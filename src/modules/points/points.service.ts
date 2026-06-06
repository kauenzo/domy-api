import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PointTransaction, User } from '../../database/entities';
import { PointsSummaryDto } from './dto/points-summary.dto';

@Injectable()
export class PointsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PointTransaction)
    private readonly pointTransactionRepository: Repository<PointTransaction>,
  ) {}

  async getSummary(userId: string): Promise<PointsSummaryDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    // Calcula total historicamente ganho (apenas transações positivas)
    const result = await this.pointTransactionRepository
      .createQueryBuilder('tx')
      .select('COALESCE(SUM(tx.amount), 0)', 'sum')
      .where('tx.user_id = :userId', { userId })
      .andWhere('tx.amount > 0')
      .getRawOne<{ sum: string }>();

    return {
      pointsBalance: user.pointsBalance,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      level: user.level,
      totalEarned: Number(result?.sum ?? 0),
    };
  }

  async getHistory(
    userId: string,
    page: number,
    limit: number,
  ): Promise<{
    data: PointTransaction[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [data, total] = await this.pointTransactionRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, page, limit };
  }
}
