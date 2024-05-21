import { User } from '@app/database-type-orm/entities/User.entity';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailOtp } from '@app/database-type-orm/entities/EmailOtp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, EmailOtp])],
  exports: [AuthService],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
