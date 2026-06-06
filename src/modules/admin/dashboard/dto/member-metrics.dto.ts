import { ApiProperty } from '@nestjs/swagger';
import { UserLevel } from '../../../../database/entities';

export class MemberMetricsDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  avatarUrl: string | null;

  @ApiProperty({ enum: UserLevel })
  level: UserLevel;

  @ApiProperty()
  pointsBalance: number;

  @ApiProperty()
  currentStreak: number;

  @ApiProperty()
  longestStreak: number;

  @ApiProperty({ description: 'Total de tarefas concluídas por este membro' })
  totalTasksCompleted: number;

  @ApiProperty({ description: 'Total de resgates realizados por este membro' })
  totalRedemptions: number;
}
