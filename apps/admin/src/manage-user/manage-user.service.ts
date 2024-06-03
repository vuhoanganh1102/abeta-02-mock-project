import { Injectable } from '@nestjs/common';
import { User } from '@app/database-type-orm/entities/User.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Exception } from '@app/core/exception';
import { ErrorCode, OTPCategory, UserType } from '@app/core/constants/enum';
import * as bcrypt from 'bcrypt';
import { SendgridService } from '@app/sendgrid';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { FirebaseUploadService } from '@app/firebase-upload';
import { assignPaging, returnPaging } from '@app/helpers';
import { PagingDto } from './dtos/paging.dto';
import { UserIdDto } from './dtos/userId.dto';
import { UpdateUserDto } from './dtos/updateUser.dto';
import { CreateUserDto } from './dtos/createUser.dto';

@Injectable()
export class ManageUserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(EmailOtp)
    private readonly emailRepository: Repository<EmailOtp>,
    private readonly firebaseService: FirebaseUploadService,
    private readonly sendGridService: SendgridService,
    private readonly dataSource: DataSource,
  ) {}

  async getUsers(pagingDto: PagingDto) {
    const params = assignPaging(pagingDto);
    const users = await this.userRepository.find({
      skip: params.pageIndex,
      take: params.pageSize,
    });
    const totalUsers = await this.userRepository.count();
    return returnPaging(users, totalUsers, params);
  }

  async updateUser(userIdDto: UserIdDto, updateUser: UpdateUserDto) {
    return await this.userRepository.update(
      { id: userIdDto.id },
      { ...updateUser },
    );
  }

  async createUser(createUser: CreateUserDto) {
    //start transaction
    return this.dataSource.transaction(async (transaction) => {
      const userRepository = transaction.getRepository(User);
      //check email existence
      const user = await userRepository.findOne({
        where: { email: createUser.email },
      });
      if (user) throw new Exception(ErrorCode.Email_Already_Exists);

      //hash password
      const password = await bcrypt.hashSync(
        createUser.password,
        bcrypt.genSaltSync(),
      );

      //create new user
      const newUser = userRepository.create({
        email: createUser.email,
        password: password,
      });
      await userRepository.save(newUser);
      //send verify link with otp
      await this.sendGridService.createOtpAndSend(
        newUser,
        UserType.USER,
        OTPCategory.REGISTER,
      );
      return {
        message: 'Check your email to verify account',
      };
    });
  }

  async getDetailUser(userIdDto: UserIdDto) {
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
      .where('user.id = :id', { id: userIdDto.id })
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

  deleteUser(userIdDto: UserIdDto) {
    return this.userRepository.update(
      { id: userIdDto.id },
      {
        deletedAt: new Date(),
      },
    );
  }

  async uploadAvatar(file, userIdDto: UserIdDto) {
    const imageUrl = await this.firebaseService.uploadSingleImage(file);
    await this.userRepository.update(
      { id: userIdDto.id },
      { avatar: imageUrl },
    );
    const user = await this.userRepository.findOne({
      where: { id: userIdDto.id },
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
