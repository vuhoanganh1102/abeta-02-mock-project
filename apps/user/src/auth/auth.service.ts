import { DataSource, Repository } from 'typeorm';
import { LoginAuthDto } from './dtos/login.dto';
import { User } from '@app/database-type-orm/entities/User.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from '@app/core/exception';
import {
  ErrorCode,
  IsCurrent,
  OTPCategory,
  UserType,
  VerifiedStatus,
} from '@app/core/constants/enum';
import * as bcrypt from 'bcrypt';
import { JwtAuthenticationService } from '@app/jwt-authentication';
import { ChangePasswordDto } from './dtos/changePassword.dto';
import { ForgetPasswordDto } from './dtos/forgetPassword.dto';
import { SendgridService } from '@app/sendgrid';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { addMinutes, format, subMinutes } from 'date-fns';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { Injectable } from '@nestjs/common';
import * as process from 'process';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(EmailOtp)
    private otpRepository: Repository<EmailOtp>,
    private jwtAuthService: JwtAuthenticationService,
    private sendGridService: SendgridService,
    private readonly dataSource: DataSource,
  ) {}

  public async login(loginDto: LoginAuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginDto.email,
      },
      select: ['id', 'email', 'password'],
    });
    if (!user) {
      throw new Exception(ErrorCode.Email_Not_Valid);
    }
    if (!bcrypt.compareSync(loginDto.password, user.password)) {
      throw new Exception(ErrorCode.Password_Not_Valid);
    }
    return this.generateTokensAndSave(user);
  }

  async sendEmailVerify(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found, 'User Not Found');
    }
    await this.sendGridService.createOtpAndSend(
      user,
      OTPCategory.REGISTER,
      UserType.USER,
    );
    return {
      message: 'Check your email',
    };
  }

  async verifyAccount(token: string) {
    const otp = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.otpCategory = :otpCategory', {
        otpCategory: OTPCategory.REGISTER,
      })
      .andWhere('otp.isCurrent = :isCurrent', {
        isCurrent: IsCurrent.IS_CURRENT,
      })
      .andWhere('otp.otp = :token', { token: token })
      .andWhere('otp.expiredAt > :now', { now: new Date() })
      .getOne();

    if (!otp) {
      throw new Exception(ErrorCode.OTP_Invalid);
    }

    await this.userRepository.update(otp.userId, {
      isVerified: VerifiedStatus.VERIFIED,
    });

    return {
      message: 'Verify Successfully',
    };
  }

  async changePassword(userId: number, changeDto: ChangePasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: userId,
      },
      select: ['email', 'password'],
    });
    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found);
    }
    if (!bcrypt.compareSync(changeDto.oldPassword, user.password)) {
      throw new Exception(ErrorCode.Password_Not_Valid);
    }
    const hashedPassword = await bcrypt.hash(
      changeDto.newPassword,
      parseInt(process.env.BCRYPT_HASH_ROUND),
    );
    await this.userRepository.update(userId, { password: hashedPassword });
    return {
      message: 'Reset Password Successfully',
    };
  }

  async forgetPassword(forgetDto: ForgetPasswordDto) {
    return this.dataSource.transaction(async (transaction) => {
      const userRepository = transaction.getRepository(User);
      //check if user existed
      const user = await userRepository.findOne({
        where: {
          email: forgetDto.email,
        },
      });
      if (!user) {
        throw new Exception(ErrorCode.User_Not_Found, 'User Not Found');
      }
      await this.sendGridService.createOtpAndSend(
        user,
        OTPCategory.FORGET_PASSWORD,
        UserType.USER,
      );
      return {
        message: 'Check your email',
      };
    });
  }

  async resetPassword(resetToken, resetDto: ResetPasswordDto) {
    const otp = await this.otpRepository
      .createQueryBuilder('otp')
      .where('otp.otpCategory = :otpCategory', {
        otpCategory: OTPCategory.FORGET_PASSWORD,
      })
      .andWhere('otp.isCurrent = :isCurrent', {
        isCurrent: IsCurrent.IS_CURRENT,
      })
      .andWhere('otp.otp = :resetToken', { resetToken: resetToken })
      .andWhere('otp.expiredAt > :now', { now: new Date() })
      .getOne();

    if (!otp) {
      throw new Exception(ErrorCode.OTP_Invalid);
    }
    const hashedPassword = await bcrypt.hash(
      resetDto.password,
      parseInt(process.env.BCRYPT_HASH_ROUND),
    );
    await this.userRepository.update(otp.userId, {
      password: hashedPassword,
    });
    return {
      message: 'Reset Password Successfully',
    };
  }

  public async refreshTokens(refreshToken: string) {
    const user = this.jwtAuthService.verifyRefreshToken(refreshToken);
    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found);
    }
    const newRefreshToken = this.jwtAuthService.generateRefreshToken({
      id: user.id,
      email: user.email,
      resetToken: user.resetToken,
    });
    await this.userRepository.update(user.id, { refreshToken });
    return { refreshToken: newRefreshToken };
  }

  private async generateTokensAndSave(user: User) {
    const accessToken = this.jwtAuthService.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = this.jwtAuthService.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    await this.userRepository.update(user.id, {
      refreshToken,
    });
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private generateRandomResetToken() {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    const length = 100;

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      token += characters.charAt(randomIndex);
    }
    return token;
  }
}
