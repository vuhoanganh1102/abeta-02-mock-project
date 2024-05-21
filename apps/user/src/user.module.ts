import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';
import { AuthModule } from './auth/auth.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, EmailOtp]),
    AuthModule,
    AttendanceModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
