import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    enum: UserRole,
    isArray: true,
    required: false,
    description: 'Roles do usuário',
  })
  roles?: UserRole[];

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
