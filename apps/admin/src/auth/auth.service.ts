import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/Login.dto';
import { Exception } from '@app/core/exception';
import { ErrorCode } from '@app/core/constants/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { Repository } from 'typeorm';
import { JwtAuthenticationService } from '@app/jwt-authentication';
import { User } from '@app/database-type-orm/entities/User.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtAuthenticationService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async loginAdmin(loginDto: LoginDto) {
    try {
      const member = await this.adminRepository.findOne({
        where: { email: loginDto.email },
        select: ['id', 'email', 'password', 'resetToken', 'refreshToken'],
      });
      // kiem tra mat khau
      const checkPassword = await bcrypt.compare(
        loginDto.password,
        member.password,
      );

      const payload = {
        id: member.id,
        email: member.email,
        role: process.env.ADMIN_SECRET_KEY,
        resetToken: member.resetToken,
      };
      // generate access token moi
      const access_token = await this.jwtService.generateAccessToken(payload);

      // kiem tra xem ref token trong db co khong va co con han k
      if (member.refreshToken !== '') {
        const expireRefToken = await this.jwtService.verifyRefreshToken(
          member.refreshToken,
        );

        if (!expireRefToken) {
          const refresh_token =
            await this.jwtService.generateRefreshToken(payload);

          const creater = await this.adminRepository.update(
            { id: member.id },
            { refreshToken: refresh_token },
          );

          if (checkPassword && member.email === loginDto.email && creater) {
            // res.setHeader('Authorization', `Bearer ${access_token}`);
            return {
              access_token,
              refresh_token,
            };
          }
        } else {
          return {
            access_token,
            refreshToken: member.refreshToken,
          };
        }
      }
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNewAccessToken(refreshToken: string) {
    try {
      const checkRefToken =
        await this.jwtService.verifyRefreshToken(refreshToken);

      if (!checkRefToken) {
        throw new Exception(ErrorCode.Token_Expired);
      } else {
        const getRefTokenInDb = await this.adminRepository.findOne({
          where: { id: checkRefToken.id },
        });

        if (!getRefTokenInDb) {
          throw new Exception(ErrorCode.Token_Not_Exist);
        } else {
          if ((await getRefTokenInDb).refreshToken === refreshToken) {
            const access_token = await this.jwtService.generateAccessToken({
              id: getRefTokenInDb.id,
              email: getRefTokenInDb.email,
              resetToken: getRefTokenInDb.resetToken,
              role: process.env.ADMIN_SECRET_KEY,
            });
            return {
              access_token,
            };
          }
          throw new Exception(ErrorCode.Auth_Failed);
        }
      }
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
