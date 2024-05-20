/* eslint-disable prettier/prettier */
import { Unauthorized } from '@app/core/exception';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Request } from 'express';
import { JwtAuthenticationModuleOptions } from './jwt-authentication.interface';
import { MODULE_OPTIONS_TOKEN } from './jwt-authentication.module-definition';
import { LiteralObject } from '@nestjs/common/cache';
import { decode } from 'punycode';

@Injectable()
export class JwtAuthenticationService {
  constructor(
    private readonly jwtService: JwtService,
    // @Inject(MODULE_OPTIONS_TOKEN)
    // public options: JwtAuthenticationModuleOptions,
  ) {}

  async validateRequest(request: Request) {
    const token = this.extractFromAuthHeaderAsBearerToken(request);

    try {
      const decoded = this.jwtService.verify<LiteralObject>(token, {
        secret: process.env.JWT_SECRET_KEY,
        algorithms: ['HS256'],
      });

      Object.assign(request, { payload: decoded });
      // request['user'] = decoded;
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
}
