import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../types/authenticated-request.type';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userRoles: string[] = request.user?.roles ?? [];

    if (!userRoles.includes('admin')) {
      throw new ForbiddenException('Usuario nao possui acesso de admin');
    }

    return true;
  }
}
