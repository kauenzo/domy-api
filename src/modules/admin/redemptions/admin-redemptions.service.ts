import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import {
  Notification,
  NotificationType,
  PointTransaction,
  PointTransactionType,
  Redemption,
  RedemptionStatus,
  Reward,
  User,
} from '../../../database/entities';
import { RejectRedemptionDto } from './dto/reject-redemption.dto';

export interface ListRedemptionsQuery {
  status?: RedemptionStatus;
  userId?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AdminRedemptionsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Redemption)
    private readonly redemptionRepository: Repository<Redemption>,
  ) {}

  async findAll(query: ListRedemptionsQuery) {
    const { status, userId, page = 1, limit = 20 } = query;

    const qb = this.redemptionRepository
      .createQueryBuilder('redemption')
      .leftJoinAndSelect('redemption.user', 'user')
      .leftJoinAndSelect('redemption.reward', 'reward')
      .leftJoinAndSelect('redemption.reviewedBy', 'reviewer')
      .orderBy('redemption.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (status) {
      qb.andWhere('redemption.status = :status', { status });
    }

    if (userId) {
      qb.andWhere('redemption.user_id = :userId', { userId });
    }

    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findById(id: string): Promise<Redemption> {
    const redemption = await this.redemptionRepository.findOne({
      where: { id },
      relations: ['user', 'reward', 'reviewedBy'],
    });

    if (!redemption) throw new NotFoundException('Resgate não encontrado');
    return redemption;
  }

  async approve(id: string, adminId: string): Promise<Redemption> {
    const redemption = await this.findById(id);

    if (redemption.status !== RedemptionStatus.PENDING) {
      throw new BadRequestException(
        'Apenas resgates com status "pending" podem ser aprovados',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const redemptionRepo = manager.getRepository(Redemption);
      const rewardRepo = manager.getRepository(Reward);
      const notificationRepo = manager.getRepository(Notification);

      // Atualiza status do resgate
      await redemptionRepo.update(id, {
        status: RedemptionStatus.APPROVED,
        reviewedById: adminId,
        reviewedAt: new Date(),
      });

      // Incrementa stock_used da recompensa
      await rewardRepo.increment({ id: redemption.rewardId }, 'stockUsed', 1);

      // Cria notificação para o membro
      await notificationRepo.save(
        notificationRepo.create({
          userId: redemption.userId,
          type: NotificationType.REDEMPTION_APPROVED,
          title: 'Resgate aprovado!',
          body: `Seu resgate foi aprovado com sucesso.`,
          referenceId: redemption.id,
        }),
      );

      return redemptionRepo.findOne({
        where: { id },
        relations: ['user', 'reward', 'reviewedBy'],
      }) as Promise<Redemption>;
    });
  }

  async reject(
    id: string,
    adminId: string,
    dto: RejectRedemptionDto,
  ): Promise<Redemption> {
    const redemption = await this.findById(id);

    if (redemption.status !== RedemptionStatus.PENDING) {
      throw new BadRequestException(
        'Apenas resgates com status "pending" podem ser rejeitados',
      );
    }

    return this.dataSource.transaction(async (manager) => {
      const redemptionRepo = manager.getRepository(Redemption);
      const userRepo = manager.getRepository(User);
      const pointTxRepo = manager.getRepository(PointTransaction);
      const notificationRepo = manager.getRepository(Notification);

      // Atualiza status do resgate
      await redemptionRepo.update(id, {
        status: RedemptionStatus.REJECTED,
        reviewedById: adminId,
        reviewedAt: new Date(),
        rejectionReason: dto.rejectionReason,
      });

      // Reembolsa os pontos ao membro
      await userRepo.increment(
        { id: redemption.userId },
        'pointsBalance',
        redemption.pointsCost,
      );

      // Cria point_transaction de estorno
      await pointTxRepo.save(
        pointTxRepo.create({
          userId: redemption.userId,
          amount: redemption.pointsCost,
          type: PointTransactionType.REDEMPTION_REFUND,
          referenceId: redemption.id,
          description: `Estorno de resgate rejeitado: ${dto.rejectionReason}`,
        }),
      );

      // Cria notificação para o membro
      await notificationRepo.save(
        notificationRepo.create({
          userId: redemption.userId,
          type: NotificationType.REDEMPTION_REJECTED,
          title: 'Resgate rejeitado',
          body: `Seu resgate foi rejeitado. Motivo: ${dto.rejectionReason}`,
          referenceId: redemption.id,
        }),
      );

      return redemptionRepo.findOne({
        where: { id },
        relations: ['user', 'reward', 'reviewedBy'],
      }) as Promise<Redemption>;
    });
  }
}
