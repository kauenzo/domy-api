import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RejectRedemptionDto {
  @ApiProperty({
    description: 'Motivo da rejeição do resgate',
    example: 'Recompensa indisponível no momento',
  })
  @IsString()
  @IsNotEmpty()
  rejectionReason: string;
}
