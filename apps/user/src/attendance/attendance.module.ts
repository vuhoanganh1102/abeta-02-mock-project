import { User } from '@app/database-type-orm/entities/User.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceService } from './attendance.service';
import { AttendanceController } from './attendance.controller';
import { Attendance } from '@app/database-type-orm/entities/Attendance.entity';
import { CompanyConfig } from '@app/database-type-orm/entities/CompanyConfig.entity';
import { Request } from '@app/database-type-orm/entities/Request.entity';
import { RequestAdmin } from '@app/database-type-orm/entities/RequestAdmin.entity';
import { FirebaseUploadModule } from '@app/firebase-upload';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Attendance,
      CompanyConfig,
      Request,
      RequestAdmin,
    ]),
    FirebaseUploadModule,
  ],
  exports: [AttendanceService],
  providers: [AttendanceService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
