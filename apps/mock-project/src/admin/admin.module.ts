import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { JwtAuthenticationModule } from '@app/jwt-authentication';
import { User } from '@app/database-type-orm/entities/User.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Admin, User]), JwtAuthenticationModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
