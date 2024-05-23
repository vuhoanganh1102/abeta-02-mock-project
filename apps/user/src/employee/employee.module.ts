import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { EmployeeService } from './employee.service';
import { EmployeeController } from './employee.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  exports: [EmployeeService],
  controllers: [EmployeeController],
  providers: [EmployeeService],
})
export class EmployeeModule {}
