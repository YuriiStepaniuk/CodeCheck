import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../../auth/jwt/authenticated-request';
import { JwtPayload } from '../../auth/jwt/jwt-payload';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<AuthenticatedRequest>();

    const user = request.user;

    if (data) {
      return user ? user[data] : null;
    }

    return user;
  },
);
