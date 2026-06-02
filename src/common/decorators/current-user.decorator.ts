import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  AuthUser,
  AuthenticatedRequest,
} from '../types/authenticated-request.type';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!data) {
      return request.user;
    }

    return request.user?.[data];
  },
);
