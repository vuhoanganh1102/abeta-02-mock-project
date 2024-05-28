import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Exception } from '@app/core/exception';
import {ErrorCode, IsCurrent, OTPCategory, UserType} from '@app/core/constants/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { Repository } from 'typeorm';
import { JwtAuthenticationService } from '@app/jwt-authentication';
import * as bcrypt from 'bcrypt';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { SendgridService } from '@app/sendgrid';
import { LoginDto } from './dtos/Login.dto';
import {format, subMinutes} from "date-fns";
require('dotenv').config();

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

      //kiem tra xem ref token trong db co khong va co con han k
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

      if (checkRefToken === false) {
        throw new Exception(ErrorCode.Token_Expired);
      } else {
        const getRefTokenInDb = await this.adminRepository.findOne({
          where: { id: checkRefToken.id },
        });

        if (!getRefTokenInDb) {
          throw new Exception(ErrorCode.Token_Not_Exist);
        } else {
          if (
            getRefTokenInDb.refreshToken === refreshToken &&
            getRefTokenInDb.resetToken === checkRefToken.resetToken
          ) {
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

  async forgotPassword(receiver: string) {
      const checkExistEmail = await this.adminRepository.findOne({
        where: { email: receiver },
      });
      if (checkExistEmail) {
        //check otp frequency
        const fiveMinutesAgo = subMinutes(new Date(), 5);
        const fiveMinutesAgoFormat = format(
            fiveMinutesAgo,
            'yyyy-MM-dd HH:mm:ss.SSSSSS',
        );
        const maxOtpInFiveMins = 5;
        const otpCountLastFiveMins = await this.emailRepository
            .createQueryBuilder('otp')
            .where('otp.email = :email', { email: receiver })
            .andWhere('otp.userType = :userType', { userType: UserType.USER })
            .andWhere('otp.createdAt > :fiveMinutesAgoFormat', {
              fiveMinutesAgoFormat,
            })
            .getCount();

        if (otpCountLastFiveMins >= maxOtpInFiveMins) {
          throw new Exception(ErrorCode.Too_Many_Requests);
        }
        const emailOtp = await this.sendGridService.generateOtp(10);
        const dateNow = new Date();
        const emailExpire = new Date(dateNow.getTime() + 15 * 60 * 1000);
        const emailExpireISO = new Date(
          emailExpire.setHours(emailExpire.getHours() + 7),
        ).toISOString();
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const checkIsCurrent = await this.emailRepository.update(
          {
            email: checkExistEmail.email,
            isCurrent: IsCurrent.IS_CURRENT,
          },
          { isCurrent: IsCurrent.IS_OLD },
        );
        const createEmail = await this.emailRepository.save({
          userId: checkExistEmail.id,
          email: checkExistEmail.email,
          otp: emailOtp,
          expiredAt: emailExpireISO,
          otpCategory: OTPCategory.FORGET_PASSWORD,
          userType: 1,
        });

        const saveCreater = await this.emailRepository.save(createEmail);
        // return createEmail;
        if (!saveCreater) return new Error('Please send otp email again.');
        else {
          const sendMail = await this.sendGridService.sendMail(
            receiver,
            'Click to link to reset password.',
            'reset-password',
            {
              link: `http://localhost:3001/api/admin/auth/reset-password-form/${emailOtp}`,
            },
          );
            return {
              message: "Check your email",
            };
        }
      } else return new Exception(ErrorCode.Email_Not_Valid).getResponse();
  }

  async resetPassword(password: string, otp: string) {
    const recentOtp = await this.emailRepository.findOne({
      where: { otp: otp, otpCategory: OTPCategory.FORGET_PASSWORD, userType: UserType.ADMIN, isCurrent: IsCurrent.IS_CURRENT },
    });
    if (!recentOtp)
      return new HttpException(
        'Have not otp, please send it.',
        HttpStatus.BAD_REQUEST,
      );
    else {
      const dateNow = new Date();
      const check = new Date(recentOtp.expiredAt);
      if (recentOtp.otp === otp && check >= dateNow) {
        const hashedPassword = await bcrypt.hash(
            password,
            parseInt(process.env.BCRYPT_HASH_ROUND),
        );
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const changePassword = await this.adminRepository.update(
          {
            email: recentOtp.email,
          },
          { password: hashedPassword },
        );
        return new HttpException('Successfully Changed.', HttpStatus.OK);
      }
      return new HttpException('Dont change.', HttpStatus.BAD_REQUEST);
    }
  }
}
