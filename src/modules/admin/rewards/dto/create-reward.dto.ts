import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateRewardDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description?: string | null;

  @IsUrl()
  @IsOptional()
  coverImageUrl?: string | null;

  @IsInt()
  @IsPositive()
  pointsCost: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  stockLimit?: number | null;

  @IsInt()
  @Min(0)
  @IsOptional()
  cooldownDays?: number | null;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
