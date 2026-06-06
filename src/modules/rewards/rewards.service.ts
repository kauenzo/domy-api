import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, IsNull, LessThanOrEqual, Repository } from 'typeorm';
import {
  PointTransaction,
  PointTransactionType,
  Redemption,
  RedemptionStatus,
  Reward,
  User,
} from '../../database/entities';

@Injectable()
export class RewardsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
    @InjectRepository(Redemption)
    private readonly redemptionRepository: Repository<Redemption>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 2.1 — Vitrine: apenas ativas, não soft-deleted, com estoque disponível
  async listAvailable(): Promise<Reward[]> {
    const qb = this.rewardRepository
      .createQueryBuilder('reward')
      .where('reward.is_active = true')
      .andWhere('reward.deleted_at IS NULL')
      .andWhere(
        '(reward.stock_limit IS NULL OR reward.stock_used < reward.stock_limit)',
      )
      .orderBy('reward.created_at', 'DESC');

    return qb.getMany();
  }

  // 2.2 — Detalhe por ID com mesmos filtros de disponibilidade
  async findAvailableById(id: string): Promise<Reward> {
    const reward = await this.rewardRepository
      .createQueryBuilder('reward')
      .where('reward.id = :id', { id })
      .andWhere('reward.is_active = true')
      .andWhere('reward.deleted_at IS NULL')
      .andWhere(
        '(reward.stock_limit IS NULL OR reward.stock_used < reward.stock_limit)',
      )
      .getOne();

    if (!reward) {
      throw new NotFoundException('Recompensa nao encontrada ou indisponivel');
    }

    return reward;
  }

  // 3.1–3.4 — Resgate com validações e transação atômica
  async redeem(rewardId: string, userId: string): Promise<Redemption> {
    // 3.1 — Validar recompensa ativa e estoque (fora da transação para resposta rápida)
    const reward = await this.rewardRepository.findOne({
      where: { id: rewardId, isActive: true, deletedAt: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException('Recompensa nao encontrada ou indisponivel');
    }

    if (reward.stockLimit !== null && reward.stockUsed >= reward.stockLimit) {
      throw new BadRequestException('Recompensa sem estoque disponivel');
    }

    return this.dataSource.transaction(async (manager) => {
      const userRepo = manager.getRepository(User);
      const rewardRepo = manager.getRepository(Reward);
      const redemptionRepo = manager.getRepository(Redemption);
      const pointTxRepo = manager.getRepository(PointTransaction);

      // Recarrega user e reward dentro da transação (evita race condition)
      const user = await userRepo.findOne({ where: { id: userId } });
      if (!user) throw new NotFoundException('Usuario nao encontrado');

      const lockedReward = await rewardRepo.findOne({
        where: { id: rewardId, isActive: true, deletedAt: IsNull() },
        lock: { mode: 'pessimistic_write' },
      });

      if (!lockedReward) {
        throw new NotFoundException(
          'Recompensa nao encontrada ou indisponivel',
        );
      }

      // Revalida estoque dentro da transação
      if (
        lockedReward.stockLimit !== null &&
        lockedReward.stockUsed >= lockedReward.stockLimit
      ) {
        throw new BadRequestException('Recompensa sem estoque disponivel');
      }

      // 3.2 — Validar saldo suficiente
      if (user.pointsBalance < lockedReward.pointsCost) {
        throw new BadRequestException(
          `Saldo insuficiente. Necessario: ${lockedReward.pointsCost}, disponivel: ${user.pointsBalance}`,
        );
      }

      // 3.3 — Validar cooldown (última redemption aprovada do par user+reward)
      if (lockedReward.cooldownDays !== null) {
        const cooldownCutoff = new Date();
        cooldownCutoff.setDate(
          cooldownCutoff.getDate() - lockedReward.cooldownDays,
        );

        const lastApproved = await redemptionRepo.findOne({
          where: {
            userId,
            rewardId,
            status: RedemptionStatus.APPROVED,
            reviewedAt: LessThanOrEqual(new Date()),
          },
          order: { reviewedAt: 'DESC' },
        });

        if (
          lastApproved?.reviewedAt &&
          lastApproved.reviewedAt > cooldownCutoff
        ) {
          const nextAllowed = new Date(lastApproved.reviewedAt);
          nextAllowed.setDate(
            nextAllowed.getDate() + lockedReward.cooldownDays,
          );
          throw new BadRequestException(
            `Cooldown ativo. Proximo resgate disponivel em: ${nextAllowed.toISOString()}`,
          );
        }
      }

      // 3.4 — Transação atômica: débito de pontos + redemption pending + point_transaction
      user.pointsBalance = user.pointsBalance - lockedReward.pointsCost;
      await userRepo.save(user);

      const redemption = await redemptionRepo.save(
        redemptionRepo.create({
          userId,
          rewardId,
          pointsCost: lockedReward.pointsCost, // snapshot do valor atual
          status: RedemptionStatus.PENDING,
        }),
      );

      await pointTxRepo.save(
        pointTxRepo.create({
          userId,
          amount: -lockedReward.pointsCost,
          type: PointTransactionType.REDEMPTION_DEBIT,
          referenceId: redemption.id,
          description: `Resgate solicitado: ${lockedReward.title}`,
        }),
      );

      return redemption;
    });
  }
}
