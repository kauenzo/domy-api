import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { Reward } from '../../../database/entities';
import { CreateRewardDto } from './dto/create-reward.dto';
import { UpdateRewardDto } from './dto/update-reward.dto';

@Injectable()
export class AdminRewardsService {
  constructor(
    @InjectRepository(Reward)
    private readonly rewardRepository: Repository<Reward>,
  ) {}

  // 3.1 — Listagem excluindo soft deleted (TypeORM withDeleted=false por padrão)
  async list(): Promise<Reward[]> {
    return this.rewardRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  // 3.2 — Criação com stock_used = 0 (default na entity)
  async create(dto: CreateRewardDto): Promise<Reward> {
    const reward = this.rewardRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      coverImageUrl: dto.coverImageUrl ?? null,
      pointsCost: dto.pointsCost,
      stockLimit: dto.stockLimit ?? null,
      cooldownDays: dto.cooldownDays ?? null,
      isActive: dto.isActive ?? true,
    });

    return this.rewardRepository.save(reward);
  }

  // 3.3 — Consulta por ID
  async findById(id: string): Promise<Reward> {
    return this.findRewardOrThrow(id);
  }

  // 3.4 — Atualização parcial com validação stock_limit >= stock_used
  async update(id: string, dto: UpdateRewardDto): Promise<Reward> {
    const reward = await this.findRewardOrThrow(id);

    if (dto.title !== undefined) reward.title = dto.title;
    if (dto.description !== undefined)
      reward.description = dto.description ?? null;
    if (dto.coverImageUrl !== undefined)
      reward.coverImageUrl = dto.coverImageUrl ?? null;
    if (dto.pointsCost !== undefined) reward.pointsCost = dto.pointsCost;
    if (dto.cooldownDays !== undefined)
      reward.cooldownDays = dto.cooldownDays ?? null;
    if (dto.isActive !== undefined) reward.isActive = dto.isActive;

    if (dto.stockLimit !== undefined) {
      const newLimit = dto.stockLimit ?? null;
      if (newLimit !== null && newLimit < reward.stockUsed) {
        throw new BadRequestException(
          `stock_limit (${newLimit}) nao pode ser menor que stock_used atual (${reward.stockUsed})`,
        );
      }
      reward.stockLimit = newLimit;
    }

    return this.rewardRepository.save(reward);
  }

  // 3.5 — Soft delete
  async softDelete(id: string): Promise<void> {
    await this.findRewardOrThrow(id);
    await this.rewardRepository.softDelete(id);
  }

  private async findRewardOrThrow(id: string): Promise<Reward> {
    const reward = await this.rewardRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });

    if (!reward) {
      throw new NotFoundException('Recompensa nao encontrada');
    }

    return reward;
  }
}
