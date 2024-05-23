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
    const storage = this.firebaseService.getStorageInstance();
    const bucket = storage.bucket();
    const fileName = `${Date.now()}_${file.originalname}`;
    const fileUpload = bucket.file(fileName);
    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${fileName}?alt=media`;

    await this.userRepository.update({ id: id }, { avatar: imageUrl });

    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimeType,
      },
    });
    new Promise((resolve, reject) => {
      stream.on('error', (err) => {
        reject(err);
      });
      stream.on('finish', () => {
        resolve(imageUrl);
      });
      stream.end(file.buffer);
    });
    return {
      image: imageUrl,
      user: this.userRepository.findOneBy({ id: id }),
    };
  }
}
