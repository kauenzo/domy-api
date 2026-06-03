export type InviteStatus = 'active' | 'used' | 'expired' | 'invalid';

export class InviteDto {
  id: string;
  token: string;
  createdById: string;
  usedById: string | null;
  expiresAt: Date;
  usedAt: Date | null;
  status: InviteStatus;
  link: string;
}
