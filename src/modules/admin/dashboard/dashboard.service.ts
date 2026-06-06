import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Redemption,
  RedemptionStatus,
  TaskInstance,
  TaskInstanceStatus,
  User,
} from '../../../database/entities';
import { DashboardOverviewDto } from './dto/dashboard-overview.dto';
import { MemberMetricsDto } from './dto/member-metrics.dto';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(TaskInstance)
    private readonly taskInstanceRepository: Repository<TaskInstance>,
    @InjectRepository(Redemption)
    private readonly redemptionRepository: Repository<Redemption>,
  ) {}

  async getGeneralOverview(): Promise<DashboardOverviewDto> {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // Contagem de tarefas de hoje por status
    const taskStatsRaw = await this.taskInstanceRepository
      .createQueryBuilder('ti')
      .select('ti.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .where('ti.scheduled_date = :today', { today })
      .groupBy('ti.status')
      .getRawMany<{ status: string; count: string }>();

    const statusMap: Record<string, number> = {};
    for (const row of taskStatsRaw) {
      statusMap[row.status] = Number(row.count);
    }

    const tasksToday = {
      pending: statusMap[TaskInstanceStatus.PENDING] ?? 0,
      inProgress: statusMap[TaskInstanceStatus.IN_PROGRESS] ?? 0,
      done: statusMap[TaskInstanceStatus.DONE] ?? 0,
      overdue: statusMap[TaskInstanceStatus.OVERDUE] ?? 0,
    };

    // Total de resgates pendentes
    const pendingRedemptions = await this.redemptionRepository.count({
      where: { status: RedemptionStatus.PENDING },
    });

    // Ranking de membros por points_balance
    const members = await this.userRepository
      .createQueryBuilder('user')
      .where('user.is_active = true')
      .orderBy('user.points_balance', 'DESC')
      .getMany();

    const ranking = members.map((user) => ({
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      pointsBalance: user.pointsBalance,
      currentStreak: user.currentStreak,
      level: user.level,
    }));

    return { tasksToday, pendingRedemptions, ranking };
  }

  async getMemberMetrics(userId: string): Promise<MemberMetricsDto> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('Membro não encontrado');
    }

    // Total de tarefas concluídas pelo membro
    const totalTasksCompleted = await this.taskInstanceRepository.count({
      where: { assignedToId: userId, status: TaskInstanceStatus.DONE },
    });

    // Total de resgates do membro
    const totalRedemptions = await this.redemptionRepository.count({
      where: { userId },
    });

    return {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      level: user.level,
      pointsBalance: user.pointsBalance,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalTasksCompleted,
      totalRedemptions,
    };
  }
}
