import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from 'src/database/entities';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsEnum(UserRole, { each: true })
  roles?: UserRole[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
