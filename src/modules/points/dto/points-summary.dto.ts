import { ApiProperty } from '@nestjs/swagger';
import { UserLevel } from '../../../database/entities';

export class PointsSummaryDto {
  @ApiProperty({ description: 'Saldo atual de pontos do membro' })
  pointsBalance: number;

  @ApiProperty({
    description:
      'Streak atual (dias consecutivos com todas as tarefas concluídas)',
  })
  currentStreak: number;

  @ApiProperty({ description: 'Maior streak já alcançado pelo membro' })
  longestStreak: number;

  @ApiProperty({ enum: UserLevel, description: 'Nível atual do membro' })
  level: UserLevel;

  @ApiProperty({
    description: 'Total de pontos ganhos historicamente (transações positivas)',
  })
  totalEarned: number;
}
