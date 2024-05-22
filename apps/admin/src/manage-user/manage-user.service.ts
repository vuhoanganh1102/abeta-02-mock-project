import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateManageUserDto } from './dto/create-manage-user.dto';
import { UpdateManageUserDto } from './dto/update-manage-user.dto';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from '@app/core/exception';
import { ErrorCode } from '@app/core/constants/enum';
import { UpdateUserDto } from './dto/UpdateUser.entity';
import { CreateUserDto } from './dto/CreateUser.entity';
import * as bcrypt from 'bcrypt';
import { SendgridService } from '@app/sendgrid';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';

class createrEmail {}
@Injectable()
export class ManageUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmailOtp)
    private readonly emailRespository: Repository<EmailOtp>,

    private readonly sendGridService: SendgridService,
  ) {}

  async getUsers() {
    try {
      const userArray = this.userRepository.find();
      if ((await userArray).length > 0)
        throw new Exception(ErrorCode.Not_Found_Data);
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

  async createUser(createUser: CreateUserDto) {
    try {
      const checkExistEmail = await this.userRepository.findOne({
        where: { email: createUser.email },
      });

      if (!checkExistEmail) {
        const password = await bcrypt.hashSync(
          createUser.password,
          bcrypt.genSaltSync(),
        );
        const creater = this.userRepository.create({
          email: createUser.email,
          password: password,
        });
        const saveUser = await this.userRepository.save(creater);

        if (!saveUser)
          return new Exception(ErrorCode.Failed_Creater).getResponse();
        else {
          const emailOtp = await this.sendGridService.generateOtp(10);
          const dateNow = new Date();
          const emailExpire = new Date(
            dateNow.getTime() + 2 * 60 * 1000,
          ).toISOString();

          // const countEmail5min = await this.sendGridService.countRecentOtps(
          //   saveUser.email,
          //   5,
          //   1,
          // );
          // if (countEmail5min < 5) {
          const createEmail = await this.emailRespository.create({
            userId: (await saveUser).id,
            email: (await saveUser).email,
            otp: emailOtp,
            expiredAt: emailExpire,
            otpCategory: 1,
          });

          const saveCreater = await this.emailRespository.save(createEmail);

          if (!saveCreater) return new Error('Please send otp email again.');
          else {
            const sendMail = this.sendGridService.sendMail(
              saveUser.email,
              'Verify email otp from manage user.',
              'verify',
              { otp: emailOtp },
            );

            return {
              user: saveUser,
              email: sendMail,
            };
          }
          // }

          // return new Error(
          //   'Exceeded OTP limit for this email within the last 5 minutes',
          // );
        }
      }

      return new Exception(ErrorCode.Email_Already_Exists).getResponse();
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async doneVerifyOtpEmail(email: string, otp: string, otpCategory: number) {
    const verifyEmail = this.sendGridService.verifyOtp(email, otp, otpCategory);

    if (verifyEmail) {
      const updateVerify = await this.userRepository.update(
        { email },
        { isVerified: 1 },
      );

      // if (!updateVerify) return new Error('Verify action is failed.');
      // return {
      //   status: 'Verified',
      // };
      // return updateVerify;
      console.log(verifyEmail);
    }
    return new Error('Verify action is failed.');
  }

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
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
