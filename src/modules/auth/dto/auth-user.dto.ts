import { ApiProperty } from '@nestjs/swagger';
import { UserLevel, UserRole } from '../../../database/entities';

export class AuthUserDto {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;

  @ApiProperty({
    enum: UserRole,
    isArray: true,
    description: 'Roles do usuário',
  })
  roles: UserRole[];

  pointsBalance: number;
  currentStreak: number;
  longestStreak: number;

  @ApiProperty({ enum: UserLevel, description: 'Nível atual do membro' })
  level: UserLevel;

  isActive: boolean;
}
