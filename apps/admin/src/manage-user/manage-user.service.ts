import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { CreateManageUserDto } from './dto/create-manage-user.dto';
// import { UpdateManageUserDto } from './dto/update-manage-user.dto';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from '@app/core/exception';
import {ErrorCode, OTPCategory} from '@app/core/constants/enum';
import { UpdateUserDto } from './dto/UpdateUser.entity';
import { CreateUserDto } from './dto/CreateUser.entity';
import * as bcrypt from 'bcrypt';
import { SendgridService } from '@app/sendgrid';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import {FirebaseUploadService} from "@app/firebase-upload";
import {Admin} from "@app/database-type-orm/entities/Admin.entity";

@Injectable()
export class ManageUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmailOtp)
    private readonly emailRespository: Repository<EmailOtp>,
    private readonly firebaseService: FirebaseUploadService,
    private readonly sendGridService: SendgridService,
  ) {}

  async getUsers() {
    try {
      const userArray = this.userRepository.find();
      if ((await userArray).length > 0) return userArray;
      throw new Exception(ErrorCode.Not_Found_Data);
    } catch (err) {
      throw new HttpException(
        'Internal Server',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateUser(id: number, updateUser: UpdateUserDto) {
      const updatedAt = new Date().toISOString();
      return await this.userRepository.update(
        { id },
        { ...updateUser, updatedAt },
      );
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
          const emailOtp = await this.sendGridService.generateOtp(50);
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

  async getDetailUser(id: number) {
    const user = await this.userRepository.createQueryBuilder('user')
        .select([
          'user.id',
          'user.avatar',
          'user.dateOfBirth',
          'user.lastName',
          'user.firstName',
          'user.phoneNumber',
          'user.email',
          'user.isVerified',
          'user.deletedAt'
        ])
        .where('user.id = :id', { id })
        .withDeleted()
        .getOne();

    if(user.deletedAt){
      throw new Exception(ErrorCode.User_Deleted);
    }
    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found);
    }

    return user;
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

  async sendAgainEmail(
    receiver: string,
    subject: string,
    templateName: string,
  ) {
    const emailOtp = await this.sendGridService.generateOtp(10);
    const dateNow = new Date();
    const emailExpire = new Date(
      dateNow.getTime() + 2 * 60 * 1000,
    ).toISOString();

    const saveUser = await this.userRepository.findOne({
      where: { email: receiver },
    });
    if (saveUser) {
      const otpCategory = templateName === 'verify' ? 1 : 2;
      const createEmail = await this.emailRespository.create({
        userId: saveUser.id,
        email: saveUser.email,
        otp: emailOtp,
        expiredAt: emailExpire,
        otpCategory,
      });

      if (saveUser.isVerified === 1)
        return new HttpException(
          'Account is verified. Please sign in.',
          HttpStatus.BAD_REQUEST,
        );
      if (createEmail) {
        const send = await this.sendGridService.sendMail(
          receiver,
          subject,
          templateName,
          {
            otp: emailOtp,
          },
        );
        if (send === false) {
          return {
            status: 'Please send again after 15 minutes. ',
          };
        } else {
          const saveOtp = await this.emailRespository.save(createEmail);
          if (saveOtp) return new HttpException('Successfully', HttpStatus.OK);
        }
      }
    }
    return new HttpException(
      'Email havent yet existed.',
      HttpStatus.BAD_REQUEST,
    );
  }

  async uploadAvatar(file, id: number) {
    console.log(id)
    const imageUrl = await this.firebaseService.uploadSingleImage(file);
    await this.userRepository.update({ id: id }, { avatar: imageUrl });
    const user = await this.userRepository.findOne({
      where: {id: id},
      select: ["id", "avatar", "dateOfBirth", "lastName", "firstName", "phoneNumber"]
    });
    return {
      image: imageUrl,
      user: {...user},
    };
  }
}
