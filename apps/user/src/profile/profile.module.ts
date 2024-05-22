import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { FirebaseUploadModule } from '@app/firebase-upload';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FirebaseUploadModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}
