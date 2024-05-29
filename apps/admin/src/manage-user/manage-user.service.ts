import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
// import { CreateManageUserDto } from './dto/create-manage-user.dto';
// import { UpdateManageUserDto } from './dto/update-manage-user.dto';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from '@app/core/exception';
import { ErrorCode, OTPCategory, UserType } from '@app/core/constants/enum';
import { UpdateUserDto } from './dto/UpdateUser.entity';
import { CreateUserDto } from './dto/CreateUser.entity';
import * as bcrypt from 'bcrypt';
import { SendgridService } from '@app/sendgrid';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { FirebaseUploadService } from '@app/firebase-upload';
// import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import * as process from 'process';

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
        const link = process.env.VERIFY_LINK + `${emailOtp}`;
        const dateNow = new Date();
        const emailExpire = new Date(
          dateNow.getTime() + 2 * 60 * 1000,
        ).toISOString();
        const createEmail = await this.emailRespository.create({
          userId: (await saveUser).id,
          email: (await saveUser).email,
          otp: emailOtp,
          expiredAt: emailExpire,
          otpCategory: OTPCategory.REGISTER,
          userType: UserType.USER,
        });
        const saveCreater = await this.emailRespository.save(createEmail);
        if (!saveCreater) return new Error('Please send otp email again.');
        else {
          const sendMail = this.sendGridService.sendMail(
            saveUser.email,
            'Verify email otp from manage user.',
            'verify',
            { link },
          );
          return {
            user: saveUser,
            email: sendMail,
          };
        }
      }
    }
    return new Exception(ErrorCode.Email_Already_Exists).getResponse();
  }

  async getDetailUser(id: number) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.avatar',
        'user.dateOfBirth',
        'user.lastName',
        'user.firstName',
        'user.phoneNumber',
        'user.email',
        'user.isVerified',
        'user.deletedAt',
      ])
      .where('user.id = :id', { id })
      .withDeleted()
      .getOne();

    if (user.deletedAt) {
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

  async uploadAvatar(file, id: number) {
    console.log(id);
    const imageUrl = await this.firebaseService.uploadSingleImage(file);
    await this.userRepository.update({ id: id }, { avatar: imageUrl });
    const user = await this.userRepository.findOne({
      where: { id: id },
      select: [
        'id',
        'avatar',
        'dateOfBirth',
        'lastName',
        'firstName',
        'phoneNumber',
      ],
    });
    return {
      image: imageUrl,
      user: { ...user },
    };
  }
}
