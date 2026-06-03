import {
  IsInt,
  IsString,
  MaxLength,
  MinLength,
  NotEquals,
} from 'class-validator';

export class AdjustPointsDto {
  @IsInt()
  @NotEquals(0)
  amount: number;

  @IsString()
  @MinLength(1)
  @MaxLength(500)
  description: string;
}
