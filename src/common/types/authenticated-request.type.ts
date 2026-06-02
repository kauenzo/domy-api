import { Request } from 'express';

export interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  roles?: string[];
  [key: string]: unknown;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
