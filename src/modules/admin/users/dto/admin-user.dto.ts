import { ApiProperty } from '@nestjs/swagger';
import { UserLevel, UserRole } from 'src/database/entities';

export class AdminUserDto {
  id: string;
  googleId: string | null;
  name: string;
  email: string;
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
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedUsersResponseDto {
  @ApiProperty({ type: [AdminUserDto] })
  items: AdminUserDto[];

  total: number;
  page: number;
  limit: number;
}
