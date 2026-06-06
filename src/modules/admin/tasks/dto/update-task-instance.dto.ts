import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTaskInstanceDto {
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
