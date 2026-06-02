import { UserLevel, UserRole } from '../../../database/entities';

export class AuthUserDto {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  roles: UserRole[];
  pointsBalance: number;
  currentStreak: number;
  longestStreak: number;
  level: UserLevel;
  isActive: boolean;
}
