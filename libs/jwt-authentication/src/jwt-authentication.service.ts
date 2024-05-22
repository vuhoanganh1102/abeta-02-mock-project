/* eslint-disable prettier/prettier */
import {
  Exception,
  // Exception,
  Unauthorized,
} from '@app/core/exception';
import {
  // Inject,
  Injectable,
} from '@nestjs/common';
import {
  JwtService,
  //  JwtVerifyOptions
} from '@nestjs/jwt';
import { Request } from 'express';
// import { JwtAuthenticationModuleOptions } from './jwt-authentication.interface';
// import { MODULE_OPTIONS_TOKEN } from './jwt-authentication.module-definition';
import { LiteralObject } from '@nestjs/common/cache';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';

import { Repository } from 'typeorm';
import { ErrorCode } from '@app/core/constants/enum';
// import { ErrorCode } from '@app/core/constants/enum';

@Injectable()
export class JwtAuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    // @Inject(MODULE_OPTIONS_TOKEN)
    // public options: JwtAuthenticationModuleOptions,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async validateRequest(request: Request) {
    const token = this.extractFromAuthHeaderAsBearerToken(request);
    console.log(token);
    try {
      const decoded = this.jwtService.verify<LiteralObject>(token, {
        secret: process.env.JWT_SECRET_KEY,
        algorithms: ['HS256'],
      });

      Object.assign(request, { payload: decoded });

      return true;
    } catch (error) {
      throw new Unauthorized(
        "Your authorization token isn't valid. Please login again!",
      );
    }
  }

  extractFromAuthHeaderAsBearerToken(req: Request) {
    // Parse the injected ID token from the request header.
    const token = req.headers.authorization || '';

    return token.trim().replace('Bearer ', '');
  }

  public generateAccessToken(payload: LiteralObject): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
    });
  }

  public generateRefreshToken(payload: LiteralObject): string {
    return this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
    });
  }

  public verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return payload;
    } catch (error) {
      return false;
    }
  }

  public verifyRefreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_KEY,
      });
      return payload;
    } catch (error) {
      return false;
    }
  }

  async validateAdminRequest(request: Request) {
    const token = this.extractFromAuthHeaderAsBearerToken(request);

    try {
      const decoded = this.jwtService.verify<LiteralObject>(token, {
        secret: process.env.JWT_SECRET_KEY,
        algorithms: ['HS256'],
      });

      Object.assign(request, { payload: decoded });

      if (decoded.role && decoded.role === 'isAdmin') return true;
      else throw new Exception(ErrorCode.Unauthorized);
    } catch (error) {
      throw new Unauthorized(
        "Your authorization token isn't valid. Please login again!",
      );
    }
  }
}
