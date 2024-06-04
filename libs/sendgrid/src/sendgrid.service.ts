import {Inject, Injectable, Logger} from '@nestjs/common';
import {MODULE_OPTIONS_TOKEN} from '@app/sendgrid/sendgrid.module-definition';
import {SendGridModuleOptions} from '@app/sendgrid/sendgrid.interface';
import * as sendGrid from '@sendgrid/mail';
import * as path from 'path';
import {readFile} from 'fs/promises';
import * as ejs from 'ejs';
import {EmailOtp} from '@app/database-type-orm/entities/EmailOtp.entity';
import {DataSource, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {addMinutes, format, subMinutes} from 'date-fns';
import {ErrorCode, IsCurrent, OTPCategory, QueueName, UserType,} from '@app/core/constants/enum';
import {Exception} from '@app/core/exception';
import {LiteralObject} from '@nestjs/common/cache';
import {SendgridDto} from "@app/sendgrid/dtos/sendgrid.dto";
import {QueueService} from "@app/queue";

require('dotenv').config();

@Injectable()
export class SendgridService {
  private readonly logger: Logger = new Logger(SendgridService.name);
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN)
    public readonly options: SendGridModuleOptions,

    @InjectRepository(EmailOtp)
    private readonly otpRepository: Repository<EmailOtp>,

    private readonly dataSource: DataSource,

    // private readonly queueService: QueueService,
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
    const template = await readFile(templatePath, 'utf-8');
    html = ejs.render(template, attachedData || {});
    const mail = {
      from: this.options.sender,
      to: receiver,
      subject: subject,
      html: html,
    };
    try {
      const info = await sendGrid.send(mail);
      this.logger.log(`Email sent! Info: ${info}`);
    } catch (error) {
      this.logger.log('Send mail failed!: ', error.response.body);
    }
  }

  async createOtpAndSend(
    receiver: LiteralObject,
    receiverType: number,
    otpType: number,
  ) {
    return this.dataSource.transaction(async (transaction) => {
      const otpRepository = transaction.getRepository(EmailOtp);
      //check otp frequency
      const fiveMinutesAgo = format(
        subMinutes(new Date(), 5),
        'yyyy-MM-dd HH:mm:ss.SSSSSS',
      );
      // const fiveMinutesAgo = subMinutes(new Date(), 5);
      const maxOtpInFiveMinutes = 5;
      const otpCountLastFiveMinutes = await otpRepository
        .createQueryBuilder('otp')
        .where('otp.email = :email', { email: receiver.email })
        .andWhere('otp.created_at > :fiveMinutesAgo', {
          fiveMinutesAgo: fiveMinutesAgo,
        })
        .getCount();
      console.log(otpCountLastFiveMinutes);
      if (otpCountLastFiveMinutes >= maxOtpInFiveMinutes) {
        throw new Exception(ErrorCode.Too_Many_Requests);
      }
      //get current otp of user in data and change status
      const result = await otpRepository
        .createQueryBuilder()
        .update('email_otp')
        .set({ isCurrent: IsCurrent.IS_OLD })
        .where('email_otp.user_email = :email', { email: receiver.email })
        .andWhere('email_otp.user_type = :userType', { userType: receiverType })
        .andWhere('email_otp.is_current = :isCurrent', {
          isCurrent: IsCurrent.IS_CURRENT,
        })
        .andWhere('email_otp.otp_category = :otpType', { otpType: otpType })
        .andWhere('email_otp.expired_at > :now', { now: new Date() })
        .execute();

      //create new otp
      const otp = this.generateOtp(parseInt(process.env.RANDOM_TOKEN_LENGTH));
      const link = this.generateLink(receiverType, otpType, otp);
      const expiredAt = addMinutes(
        new Date(),
        parseInt(process.env.OTP_EXPIRY_TIME),
      ).toISOString();
      const newOtpRecord = await this.otpRepository.create({
        otp: otp,
        userId: receiver.id,
        email: receiver.email,
        isCurrent: IsCurrent.IS_CURRENT,
        otpCategory: otpType,
        expiredAt: expiredAt,
        userType: receiverType,
      });

      await otpRepository.save(newOtpRecord);

      //push to send-mail queue
      const receiverEmail = receiver.email
      const subject = otpType === OTPCategory.REGISTER
              ? 'Verify Your Account'
              : 'Reset Your Password';
      const template = otpType === OTPCategory.REGISTER ? './verify' : './reset-password';

      // await this.queueService.addSendMailQueue(
      //     QueueName.SEND_MAIL,
      //     {
      //       receiverEmail,
      //       subject,
      //       template,
      //       link,
      //     },
      // )
      return {
          receiverEmail,
          subject,
          template,
          link,
      };
    });
  }

  public generateOtp(length: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      otp += characters.charAt(randomIndex);
    }
    return otp;
  }

  public generateLink(receiverType: number, otpType: number, otp: string) {
    if (receiverType === UserType.ADMIN && otpType === OTPCategory.REGISTER)
      return process.env.VERIFY_LINK_ADMIN + `${otp}`;
    if (
      receiverType === UserType.ADMIN &&
      otpType === OTPCategory.FORGET_PASSWORD
    )
      return process.env.RESET_LINK_ADMIN + `${otp}`;
    if (receiverType === UserType.USER && otpType === OTPCategory.REGISTER)
      return process.env.VERIFY_LINK_USER + `${otp}`;
    if (
      receiverType === UserType.USER &&
      otpType === OTPCategory.FORGET_PASSWORD
    )
      return process.env.RESET_LINK_USER + `${otp}`;
  }
}
