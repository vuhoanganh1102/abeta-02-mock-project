import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'libs/jwt-authentication/src/jwt-authentication.decorator';
import { Observable } from 'rxjs';
import { UserType } from '../constants/enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const user = context?.switchToHttp().getRequest().payload;

    return [UserType.SUPER_ADMIN, UserType.ADMIN].includes(
      user.userType as any,
    );
  }
}
