import { Inject, Injectable, Logger } from '@nestjs/common';
import { MODULE_OPTIONS_TOKEN } from '@app/sendgrid/sendgrid.module-definition';
import { SendGridModuleOptions } from '@app/sendgrid/sendgrid.interface';
import * as sendGrid from '@sendgrid/mail';
import * as path from 'path';
import { readFile } from 'fs/promises';
import * as ejs from 'ejs';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class SendgridService {
  private readonly logger: Logger = new Logger(SendgridService.name);
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    public readonly options: SendGridModuleOptions,

    @InjectRepository(EmailOtp)
    private readonly otpEmailRepo: Repository<EmailOtp>,
  ) {
    sendGrid.setApiKey(this.options.apiKey);
  }

  async sendMail(
    receiver: string,
    subject: string,
    templateName: string,
    attachedData?: any,
    html?: string,
  ) {
    const templatePath = path.join(
      __dirname,
      '..',
      '..',
      '..',
      'libs',
      'sendgrid',
      'src',
      'templates',
      `${templateName}.ejs`,
    );
    console.log(templatePath);
    const template = await readFile(templatePath, 'utf-8');
    html = ejs.render(template, attachedData || {});
    console.log(attachedData);
    const mail = {
      from: this.options.sender,
      to: receiver,
      subject: subject,
      html: html,
    };
    try {
      const otpCategory = templateName === 'verify' ? 1 : 2;
      const countRecentOtps = await this.countRecentOtps(
        receiver,
        5,
        otpCategory,
      );
      console.log(countRecentOtps);
      if (countRecentOtps >= 5) {
        return false;
      } else {
        const info = await sendGrid.send(mail);
        this.logger.log(`Email sent! Info: ${info}`);
      }
    } catch (error) {
      this.logger.log('Send mail failed!: ', error.response.body);
    }
  }
  async countTime(email: string, type: number): Promise<number> {
    const countTime = await this.otpEmailRepo.count({
      where: { email, otpCategory: type },
    });
    return countTime;
  }

  async countRecentOtps(
    email: string,
    minutes: number,
    otpCategory: number,
  ): Promise<number> {
    const now = new Date();
    const endtime = new Date(now.setHours(now.getHours() + 7)).toISOString();
    // const timeLimit = new Date();
    // timeLimit.setMinutes(timeLimit.getMinutes() - minutes); // Tính thời gian trước đây
    /// Đếm thời gian gửi trong minutes phut
    //10 5 11 6 12 7 13 8 14 9 15 10 16 11
    const starttime = new Date(
      now.setMinutes(now.getMinutes() - 5),
    ).toISOString();
    const count = await this.otpEmailRepo
      .createQueryBuilder('otp')
      .where('otp.email = :email AND otp.otp_category = :type', {
        email,
        type: otpCategory,
      })
      .andWhere('otp.createdAt >= :starttime AND otp.createdAt <= :endtime', {
        starttime,
        endtime,
      })
      .getCount();
    return count;
  }

  async isOtpExpired(
    email: string,
    otp: string,
    otpCategory: number,
  ): Promise<boolean> {
    const otpEmail = await this.otpEmailRepo.findOne({
      where: {
        email,
        otp,
        otpCategory,
      },
    });
    const dateNow = new Date();
    const expiredAt = await new Date(otpEmail.createdAt);
    console.log(expiredAt);
    console.log(dateNow);
    if (expiredAt < dateNow) return true; // Nếu không tìm thấy OTP hoặc đã hết hạn, trả về true
    return false;
  }

  async verifyOtp(
    email: string,
    otp: string,
    otpCategory: number,
  ): Promise<boolean> {
    // Tìm kiếm OTP gần đây nhất cho địa chỉ email
    const recentOtp = await this.otpEmailRepo.findOne({
      where: { email, otpCategory },
      order: { createdAt: 'DESC' }, // Sắp xếp theo thời gian giảm dần để lấy OTP gần nhất
    });

    // Kiểm tra nếu không có OTP gần đây hoặc OTP nhập vào không khớp
    if (!recentOtp || recentOtp.otp !== otp) {
      return false; // OTP không hợp lệ
    }

    // Kiểm tra xem thời gian hiện tại có nhỏ hơn thời gian hết hạn của OTP hay không
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() + 7);
    const otpExpirationTime = new Date(recentOtp.createdAt);
    otpExpirationTime.setMinutes(otpExpirationTime.getMinutes() + 3); // Thời gian hết hạn là 3 phút sau thời điểm gửi OTP
    console.log(currentTime.toISOString());
    console.log(otpExpirationTime.toISOString());
    if (currentTime.toISOString() > otpExpirationTime.toISOString()) {
      return false; // Thời gian đã hết hạn
    }
    return true; // OTP hợp lệ và chưa hết hạn
  }

  async generateOtp(length: number): Promise<string> {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters[randomIndex];
    }
    return otp;
  }
}
