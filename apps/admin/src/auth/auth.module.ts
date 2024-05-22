import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { User } from '@app/database-type-orm/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Admin])],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
