import { ApiProperty } from '@nestjs/swagger';
import { UserLevel } from '../../../../database/entities';

export class MemberRankingItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  avatarUrl: string | null;

  @ApiProperty()
  pointsBalance: number;

  @ApiProperty()
  currentStreak: number;

  @ApiProperty({ enum: UserLevel })
  level: UserLevel;
}

export class TasksDayStatsDto {
  @ApiProperty()
  pending: number;

  @ApiProperty()
  inProgress: number;

  @ApiProperty()
  done: number;

  @ApiProperty()
  overdue: number;
}

export class DashboardOverviewDto {
  @ApiProperty({ type: TasksDayStatsDto })
  tasksToday: TasksDayStatsDto;

  @ApiProperty()
  pendingRedemptions: number;

  @ApiProperty({ type: [MemberRankingItemDto] })
  ranking: MemberRankingItemDto[];
}
