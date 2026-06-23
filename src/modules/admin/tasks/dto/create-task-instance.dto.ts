import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskInstanceStatus } from '../../../../database/entities/task-instance.entity';

export class CreateTaskInstanceDto {
  @ApiProperty({
    description: 'ID do template de tarefa',
    example: 'd3b07384-d113-49cd-a5d6-8c9e4213d2f3',
  })
  @IsUUID()
  @IsNotEmpty()
  templateId: string;

  @ApiProperty({
    description: 'ID do membro atribuído',
    example: 'd3b07384-d113-49cd-a5d6-8c9e4213d2f3',
  })
  @IsUUID()
  @IsNotEmpty()
  assignedToId: string;

  @ApiProperty({
    description: 'Data agendada (YYYY-MM-DD)',
    example: '2026-07-01',
  })
  @IsNotEmpty()
  @IsString()
  scheduledDate: string;

  @ApiProperty({
    description: 'Prazo final da tarefa (ISO 8601)',
    example: '2026-07-01T23:59:00.000Z',
  })
  @IsNotEmpty()
  @IsDateString()
  deadlineAt: string;

  @ApiPropertyOptional({
    description: 'Status inicial da tarefa',
    enum: TaskInstanceStatus,
    default: TaskInstanceStatus.PENDING,
  })
  @IsOptional()
  @IsEnum(TaskInstanceStatus)
  status?: TaskInstanceStatus;

  @ApiPropertyOptional({
    description: 'Título sobreposto para esta ocorrência',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  overrideTitle?: string;

  @ApiPropertyOptional({
    description: 'Descrição sobreposta para esta ocorrência',
  })
  @IsOptional()
  @IsString()
  overrideDescription?: string;

  @ApiPropertyOptional({
    description: 'Prazo sobreposto para esta ocorrência (ISO 8601)',
    example: '2026-07-01T23:59:00.000Z',
  })
  @IsOptional()
  @IsDateString()
  overrideDeadlineAt?: string;
}
