import { UserRole } from '../../../database/entities';

export interface AuthPrincipal {
  id: string;
  email: string;
  name: string;
  roles: UserRole[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
