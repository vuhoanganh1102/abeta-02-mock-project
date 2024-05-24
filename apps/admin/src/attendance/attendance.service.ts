import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Attendance } from '@app/database-type-orm/entities/Attendance.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { format } from 'date-fns';
import {assignPaging, returnPaging} from "@app/helpers";

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  async getListAttendanceToday(pageIndex: number, pageSize: number) {
    const params = assignPaging({
      pageIndex: pageIndex,
      pageSize: pageSize,
    });
    const attendances = await this.attendanceRepository.find({
      where: {
        date: format(new Date(), 'yyyy-MM-dd'),
      },
      skip: params.skip,
      take: params.pageSize
    });
    const totalAttendances = await this.attendanceRepository.count({
      where: {
        date: format(new Date(), 'yyyy-MM-dd'),
      },
    });
    return {
      attendances: returnPaging(attendances, totalAttendances, params),
    }
  }

  async getListAttendanceInADay(date: string) {
    return await this.attendanceRepository.find({
      where: {
        date: date,
      },
    });
  }

  getOneAttendance(id: number) {
    return this.attendanceRepository.findOneBy({
      id: id,
    });
  }

  async getListAttendanceOfUser(start: string, end: string, id: number, pageIndex: number, pageSize: number) {
    const params = assignPaging({
      pageIndex: pageIndex,
      pageSize: pageSize,
    });
    const queryBuilder = await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.date >= :start', { start })
      .andWhere('attendance.date <= :end', { end })
      .skip(params.skip)
        .take(params.pageSize);
    if (id) {
      queryBuilder.andWhere('attendance.userId = :id', { id });
    }
    const attendances = await queryBuilder.getMany();
    const totalAttendances = await queryBuilder.getCount();
    return {
      attendances: returnPaging(attendances, totalAttendances, params)
    }
  }
}
