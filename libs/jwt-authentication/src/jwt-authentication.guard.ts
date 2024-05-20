import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from './jwt-authentication.decorator';
import { JwtAuthenticationService } from './jwt-authentication.service';

@Injectable()
export class JwtAuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @Inject(JwtAuthenticationService)
    private readonly jwtAuthenticationService: JwtAuthenticationService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    /* -------------------------------------------------------------------------- */
    /*                     You can implement custom logic here                    */
    /* -------------------------------------------------------------------------- */
    /* -------------------------------------------------------------------------- */
    /*                              End custom logic                              */
    /* -------------------------------------------------------------------------- */

    return this.jwtAuthenticationService.validateRequest(request);
  }
}
