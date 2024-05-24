import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Repository } from 'typeorm';
import { UpdateProfileDto } from './dtos/updateProfile.dto';
import { Exception } from '@app/core/exception';
import { ErrorCode } from '@app/core/constants/enum';
import { FirebaseUploadService } from '@app/firebase-upload';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly firebaseService: FirebaseUploadService,
  ) {}

  async getProfile(user: User) {
    return await this.userRepository.findOne({
      where: {
        id: user.id,
      },
      select: ['firstName', 'lastName', 'phoneNumber', 'avatar', 'dateOfBirth'],
    });
  }

  async updateProfile(id: number, updateDto: UpdateProfileDto) {
    const user = await this.userRepository.findOne({
      where: {
        id: id,
      },
      select: ['email'],
    });
    if (!user) {
      throw new Exception(ErrorCode.User_Not_Found, 'User Not Found');
    }
    await this.userRepository.update(id, updateDto);
    return {
      ...user,
      ...updateDto,
    };
  }

  async uploadAvatar(file, id: number) {
    const imageUrl = await this.firebaseService.uploadSingleImage(file);
    await this.userRepository.update({ id: id }, { avatar: imageUrl });
    return {
      image: imageUrl,
      user: this.userRepository.findOneBy({ id: id }),
    };
  }
}
