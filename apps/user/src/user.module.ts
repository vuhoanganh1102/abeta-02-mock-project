import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailOtp]), AuthModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
