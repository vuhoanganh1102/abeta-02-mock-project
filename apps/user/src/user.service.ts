import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "@app/database-type-orm/entities/User.entity";
import {Repository} from "typeorm";
import {ForgotPasswordDto} from "./forgotPassword.dto";
import {Exception} from "@app/core/exception";
import {ErrorCode, IsCurrent, OTPCategory} from "@app/core/constants/enum";
import { addMinutes, format, subMinutes } from 'date-fns';
import process from "process";
import {EmailOtp} from "@app/database-type-orm/entities/EmailOtp.entity";
import {SendgridService} from "@app/sendgrid";
require('dotenv').config();

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      @InjectRepository(EmailOtp)
      private readonly otpRepository: Repository<EmailOtp>,
      private readonly sendgridService: SendgridService,
  ) {
  }

  async forgotPassword(forgetDto: ForgotPasswordDto){
    const existedUser = await this.userRepository.findOne({
      where: {
        email: forgetDto.email,
      },
    });
    if (!existedUser) {
      throw new Exception(ErrorCode.User_Not_Found, 'User Not Found');
    }
    //send otp
    await this.sendOtp(existedUser, OTPCategory.FORGET_PASSWORD);
    return {
      message: 'Check your email',
    };
  }

  async sendOtp(user: User, otpType: number) {
    //check otp frequency
    const fiveMinutesAgo = subMinutes(new Date(), 5);
    const maxOtpInFiveMins = 5;
    const otpCountLastFiveMins = await this.otpRepository
        .createQueryBuilder('otp')
        .where('otp.userId = :userId', { userId: user.id })
        .andWhere('otp.createdAt > :fiveMinutesAgo', { fiveMinutesAgo })
        .getCount();
    if (otpCountLastFiveMins >= maxOtpInFiveMins) {
      throw new Exception(ErrorCode.Too_Many_Requests);
    }
    //get current otp of user in data
    const otpRecord = await this.otpRepository
        .createQueryBuilder('otp')
        .where('otp.userId = :userId', { userId: user.id })
        .andWhere('otp.isCurrent = :isCurrent', {
          isCurrent: IsCurrent.IS_CURRENT,
        })
        .andWhere('otp.otpCategory = :otpType', { otpType: otpType })
        .andWhere('otp.expiredAt > :now', { now: new Date() })
        .getOne();


    //change current status for that otp
    if (otpRecord){
      otpRecord.isCurrent = IsCurrent.IS_OLD;
      await this.otpRepository.save(otpRecord);
    }

    //create new otp
    const otp = Math.random().toString().substring(2, 8);
    const expiredAt = addMinutes(
        new Date(),
        5,
    );

    const expiredAtString = format(expiredAt, 'yyyy-MM-dd HH:mm:ss');
    const newOtp = this.otpRepository.create({
      otp: otp,
      userId: user.id,
      email: user.email,
      isCurrent: IsCurrent.IS_CURRENT,
      otpCategory: otpType,
      expiredAt: expiredAtString,
    });

    await this.otpRepository.save(newOtp);

    //send
    await this.sendgridService.sendMail(
        user.email,
        otpType === OTPCategory.REGISTER
            ? 'Verify Your Account'
            : 'Reset Your Password',
        otpType === OTPCategory.REGISTER ? './verify' : './reset-password',
        { otp },
    );
    return {
      message: 'Check your email',
    };
  }
}
