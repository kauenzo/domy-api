import { UserLevel, UserRole } from 'src/database/entities';

export class AdminUserDto {
  id: string;
  googleId: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  roles: UserRole[];
  pointsBalance: number;
  currentStreak: number;
  longestStreak: number;
  level: UserLevel;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class PaginatedUsersResponseDto {
  items: AdminUserDto[];
  total: number;
  page: number;
  limit: number;
}
