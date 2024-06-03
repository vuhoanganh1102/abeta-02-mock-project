import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Exception } from '@app/core/exception';
import {
  ErrorCode,
  IsCurrent,
  OTPCategory,
  UserType,
} from '@app/core/constants/enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { DataSource, Repository } from 'typeorm';
import { JwtAuthenticationService } from '@app/jwt-authentication';
import * as bcrypt from 'bcrypt';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { SendgridService } from '@app/sendgrid';
import * as process from 'process';
import { LoginDto } from './dtos/login.dto';
import { ChangePasswordDto } from './dtos/changePassword.dto';
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
    private readonly dataSource: DataSource,
  ) {}
  async loginAdmin(loginDto: LoginDto) {
    //check user existence
    const admin = await this.adminRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'password', 'email', 'resetToken'],
    });
    if (!admin) throw new Exception(ErrorCode.Admin_Not_Found);
    //check password
    if (!bcrypt.compareSync(loginDto.password, admin.password))
      throw new Exception(ErrorCode.Password_Not_Valid);
    //generate tokens
    return await this.generateTokensAndSave(admin);
  }

  async generateTokensAndSave(admin: Admin) {
    //generate access token
    const accessToken = this.jwtService.generateAccessToken({
      id: admin.id,
      email: admin.email,
      resetToken: admin.resetToken,
      role: process.env.ADMIN_SECRET_KEY,
    });
    //generate refresh token
    const refreshToken = this.jwtService.generateRefreshToken({
      id: admin.id,
      email: admin.email,
      resetToken: admin.resetToken,
      role: process.env.ADMIN_SECRET_KEY,
    });
    //save refresh token into database
    await this.adminRepository.update(admin.id, { refreshToken: refreshToken });
    //return tokens
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    //decode refresh token
    const payload = await this.jwtService.verifyRefreshToken(refreshToken);
    if (!payload) throw new Exception(ErrorCode.Token_Expired);
    //compare reset token
    const user = await this.adminRepository.findOne({
      where: { resetToken: payload.resetToken },
    });
    if (!user) throw new Exception(ErrorCode.Reset_Token_Invalid);
    //generate new access token
    return {
      accessToken: this.jwtService.generateAccessToken({
        id: payload.id,
        email: payload.email,
        resetToken: payload.resetToken,
        role: process.env.ADMIN_SECRET_KEY,
      }),
    };
  }

  async forgotPassword(email: string) {
    //check email existence
    const admin = await this.adminRepository.findOne({
      where: { email: email },
    });
    if (!admin) throw new Exception(ErrorCode.Email_Not_Valid);
    //send
    await this.sendGridService.createOtpAndSend(
      admin,
      OTPCategory.FORGET_PASSWORD,
      UserType.ADMIN,
    );
    return {
      message: 'Check your email',
    };
  }

  async resetPassword(password: string, otp: string) {
    //start transaction
    return this.dataSource.transaction(async (transaction) => {
      const adminRepository = transaction.getRepository(Admin);
      const otpRepository = transaction.getRepository(EmailOtp);
      //check otp existence and expiration
      const checkOtp = await adminRepository
        .createQueryBuilder('otp')
        .where('otp.otp = :otp', { otp: otp })
        .andWhere('otp.otpCategory = :otpCategory', {
          otpCategory: OTPCategory.FORGET_PASSWORD,
        })
        .andWhere('otp.isCurrent = :isCurrent', {
          isCurrent: IsCurrent.IS_CURRENT,
        })
        .andWhere('otp.userType = :userType', { userType: UserType.ADMIN })
        .andWhere('otp.expiredAt >= :now', { now: new Date() })
        .getOne();
      if (!checkOtp) throw new Exception(ErrorCode.OTP_Invalid);
      //hash and update password
      const newPassword = bcrypt.hashSync(password, bcrypt.genSaltSync());
      await adminRepository.update(
        { id: checkOtp.id },
        { password: newPassword },
      );
      //update otp status
      await otpRepository.update({ otp: otp }, { isCurrent: IsCurrent.IS_OLD });
    });
  }

  async changePassword(id: number, changeDto: ChangePasswordDto) {
    //find admin
    const admin = await this.adminRepository.findOne({
      where: { id },
      select: ['password'],
    });
    if (!admin) throw new Exception(ErrorCode.Admin_Not_Found);
    //compare old password
    const compare = await bcrypt.compare(changeDto.oldPassword, admin.password);
    if (!compare) throw new Exception(ErrorCode.Password_Not_Valid);
    //change new password
    const newPassword = bcrypt.hash(
      changeDto.newPassword,
      process.env.BCRYPT_HASH_ROUND,
    );
    await this.adminRepository.update(id, { password: newPassword });
    return {
      message: 'Change password successfully',
    };
  }
}
