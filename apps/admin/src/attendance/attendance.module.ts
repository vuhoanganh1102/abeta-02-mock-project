import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Attendance } from '@app/database-type-orm/entities/Attendance.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { RequestAdmin } from '@app/database-type-orm/entities/RequestAdmin.entity';
import { Request } from '@app/database-type-orm/entities/Request.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Admin, Attendance, User, RequestAdmin, Request]),
  ],
  exports: [AttendanceService],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
