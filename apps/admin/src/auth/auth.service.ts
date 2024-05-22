import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { Exception } from '@app/core/exception';
import { ErrorCode } from '@app/core/constants/enum';
import { UpdateUserDto } from './dtos/updateUser.entity';
import { CreateUserDto } from './dtos/createUser.entity';
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
      const access_token = await this.jwtService.generateAccessToken(payload);

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

  async getUsers() {
    console.log('here');
    try {
      console.log(this.userRepository.find());
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getNewAccessToken(refreshToken: string) {
    try {
      const checkToken = await this.jwtService.verifyRefreshToken(refreshToken);

      if (!checkToken) {
        throw new Exception(ErrorCode.Token_Expired);
      } else {
        const checkToken2 = await this.adminRepository.findOne({
          where: { id: checkToken.id },
        });
        // return checkToken2;
        if (!checkToken2) {
          throw new Exception(ErrorCode.Token_Not_Exist);
        } else {
          if ((await checkToken2).refreshToken === refreshToken) {
            const access_token = await this.jwtService.generateAccessToken({
              id: checkToken2.id,
              email: checkToken2.email,
              resetToken: checkToken2.resetToken,
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

  async updateUser(id: number, updateUser: UpdateUserDto) {
    try {
      const updatedAt = new Date().toISOString();
      const updater = await this.userRepository.update(
        { id },
        { ...updateUser, updatedAt },
      );

      return updater;
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createUser(createUser: CreateUserDto) {}

  async getDetailUser(id: number) {
    try {
      const find = await this.userRepository.findOne({ where: { id } });
      if (find) return find;
      return {
        status: 'Not Found Data.',
      };
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteUser(id: number) {
    try {
      const deletedAt = new Date().toISOString();
      const updatedAt = new Date().toISOString();
      const update = await this.userRepository.update(
        { id },
        { deletedAt, updatedAt },
      );

      return update;
      // console.log(update.affected);
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
