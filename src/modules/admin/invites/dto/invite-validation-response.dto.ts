import { InviteStatus } from './invite.dto';

export class InviteValidationResponseDto {
  token: string;
  isValid: boolean;
  status: InviteStatus;
  expiresAt: Date | null;
  usedAt: Date | null;
}
