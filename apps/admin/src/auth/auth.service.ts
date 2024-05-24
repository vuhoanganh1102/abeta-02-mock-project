import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/Login.dto';
import { Exception } from '@app/core/exception';
import { ErrorCode } from '@app/core/constants/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { Repository } from 'typeorm';
import { JwtAuthenticationService } from '@app/jwt-authentication';
import * as bcrypt from 'bcrypt';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { SendgridService } from '@app/sendgrid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    private readonly jwtService: JwtAuthenticationService,
    @InjectRepository(EmailOtp)
    private readonly emailRepository: Repository<EmailOtp>,

    private readonly sendGridService: SendgridService,
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

  async sendMailToRessetPassword(receiver: string) {
    try {
      const checkExistEmail = await this.adminRepository.findOne({
        where: { email: receiver },
      });

      if (checkExistEmail) {
        const emailOtp = await this.sendGridService.generateOtp(10);
        const dateNow = new Date();
        const emailExpire = new Date(
          dateNow.getTime() + 15 * 60 * 1000,
        ).toISOString();

        const createEmail = await this.emailRepository.create({
          userId: checkExistEmail.id,
          email: checkExistEmail.email,
          otp: emailOtp,
          expiredAt: emailExpire,
          otpCategory: 2,
        });

        const saveCreater = await this.emailRepository.save(createEmail);

        if (!saveCreater) return new Error('Please send otp email again.');
        else {
          const accessToken = await this.jwtService.generateAccessToken({
            id: checkExistEmail.id,
            email: checkExistEmail.email,
            role: process.env.ADMIN_SECRET_KEY,
          });
          const sendMail = await this.sendGridService.sendMail(
            receiver,
            'Click to link to reset password.',
            'reset-password',
            {
              resetLink: `http://localhost:3000/api/reset-password-form/${emailOtp}`,
            },
          );

          return {
            accessToken,
          };

          // return {
          //   user: saveUser,
          //   email: sendMail,
          // };
        }
      }
      return new Exception(ErrorCode.Email_Not_Valid).getResponse();
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async ressetPassword(
    password: string,
    id: string,
    email: string,
    adminId: number,
  ) {
    // Tìm kiếm OTP gần đây nhất cho địa chỉ email
    const recentOtp = await this.emailRepository.findOne({
      where: { email, otpCategory: 2 },
      order: { createdAt: 'DESC' }, // Sắp xếp theo thời gian giảm dần để lấy OTP gần nhất
    });
    if (!recentOtp)
      return new HttpException(
        'Have not otp, please send it.',
        HttpStatus.BAD_REQUEST,
      );
    else {
      const now = new Date();
      if (recentOtp.otp === id && recentOtp.expiredAt >= now.toISOString()) {
        const changePassword = await this.adminRepository.update(
          {
            id: adminId,
          },
          { password },
        );
        if (changePassword)
          return new HttpException('Successfully', HttpStatus.OK);

        return new HttpException(
          'Change pass fail, please try.',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }
}
