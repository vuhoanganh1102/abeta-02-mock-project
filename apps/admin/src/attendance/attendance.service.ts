import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Attendance } from '@app/database-type-orm/entities/Attendance.entity';
import { Admin } from '@app/database-type-orm/entities/Admin.entity';
import { format } from 'date-fns';
import { RequestAdmin } from '@app/database-type-orm/entities/RequestAdmin.entity';
import { Request } from '@app/database-type-orm/entities/Request.entity';
import { assignPaging, returnPaging } from '@app/helpers/utils';
import { Exception } from '@app/core/exception';
import {
  AttendanceStatus,
  ErrorCode,
  RequestStatus,
} from '@app/core/constants/enum';
import { AttendanceRequestPageDto } from './dtos/attendanceRequestPage.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    @InjectRepository(RequestAdmin)
    private readonly requestAdminRepository: Repository<RequestAdmin>,
    @InjectRepository(Request)
    private readonly requestRepository: Repository<Request>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  private companyConfig = {
    morningStartTime: '08:00:00',
    morningEndTime: '12:00:00',
    afternoonStartTime: '13:30:00',
    afternoonEndTime: '17:30:00',
    endTime: '22:00:00',
  };
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
      take: params.pageSize,
    });
    const totalAttendances = await this.attendanceRepository.count({
      where: {
        date: format(new Date(), 'yyyy-MM-dd'),
      },
    });
    return {
      attendances: returnPaging(attendances, totalAttendances, params),
    };
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

  async getListAttendanceOfUser(
    start: string,
    end: string,
    id: number,
    pageIndex: number,
    pageSize: number,
  ) {
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
      attendances: returnPaging(attendances, totalAttendances, params),
    };
  }

  async getListRequestAttendanceOfUser(
    adminId: number,
    attendanceRequestPageDto: AttendanceRequestPageDto,
  ) {
    const params = assignPaging(attendanceRequestPageDto);

    const [attendanceRequests, totalAttendanceRequests] =
      await this.requestAdminRepository
        .createQueryBuilder('request_admin')
        .leftJoinAndSelect('request_admin.request', 'request')
        .leftJoinAndSelect('request.attendance', 'attendance')
        .leftJoinAndSelect('attendance.user', 'user')
        .where('request_admin.adminId = :adminId', {
          adminId: adminId,
        })
        .andWhere('request.status = :status', {
          status: RequestStatus.UNRESOLVED,
        })
        .select([
          'request_admin',
          'request',
          'attendance',
          'user.avatar',
          'user.firstName',
          'user.lastName',
        ])
        .skip(params.skip)
        .take(params.pageSize)
        .getManyAndCount();

    const pagingResult = returnPaging(
      attendanceRequests,
      totalAttendanceRequests,
      params,
    );

    return pagingResult;
  }

  async acceptRequestAttendanceOfUser(requestId: number) {
    const request = await this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.attendance', 'attendance')
      .leftJoinAndSelect('attendance.user', 'user')
      .where('request.id = :requestId', {
        requestId: requestId,
      })
      .andWhere('request.status = :status', {
        status: RequestStatus.UNRESOLVED,
      })
      .select([
        'request',
        'attendance',
        'user.avatar',
        'user.firstName',
        'user.lastName',
      ])
      .getOne();

    if (!request) throw new Exception(ErrorCode.Attendance_Request_Not_Found);

    return this.dataSource.transaction(async (manager) => {
      const attendanceRepo = manager.getRepository(Attendance);
      const requestRepo = manager.getRepository(Request);

      await requestRepo.update(requestId, {
        status: RequestStatus.APPROVED,
      });

      let lateTime, workHours;

      if (
        this.compareSmallerTime(
          format(request.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        ) &&
        this.compareSmallerTime(
          format(request.checkOut, 'HH:mm:ss'),
          this.companyConfig.afternoonStartTime,
        )
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.morningStartTime,
          format(request.checkIn, 'HH:mm:ss'),
        );
        const workHoursMorning = +this.calculateTimeToHours(
          format(request.checkIn, 'HH:mm:ss'),
          format(request.checkOut, 'HH:mm:ss'),
        );
        workHours = workHoursMorning;
      }

      if (
        this.compareSmallerTime(
          format(request.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        ) &&
        !this.compareSmallerTime(
          format(request.checkOut, 'HH:mm:ss'),
          this.companyConfig.afternoonStartTime,
        )
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.morningStartTime,
          format(request.checkIn, 'HH:mm:ss'),
        );
        const workHoursMorning = +this.calculateTimeToHours(
          format(request.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        );
        const workHoursAfternoon = +this.calculateTimeToHours(
          this.companyConfig.afternoonStartTime,
          format(request.checkOut, 'HH:mm:ss'),
        );

        workHours = workHoursMorning + workHoursAfternoon;
      }

      if (
        !this.compareSmallerTime(
          format(request.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        )
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.afternoonStartTime,
          format(request.checkIn, 'HH:mm:ss'),
        );
        const workHoursAfternoon = +this.calculateTimeToHours(
          format(request.checkIn, 'HH:mm:ss'),
          format(request.checkOut, 'HH:mm:ss'),
        );
        workHours = workHoursAfternoon;
      }

      await attendanceRepo.update(request.attendanceId, {
        checkIn: request.checkIn,
        checkOut: request.checkOut,
        lateTime: lateTime,
        workHours: workHours,
        status: AttendanceStatus.ACTIVE,
      });

      return {
        message: 'success',
      };
    });
  }

  async rejectRequestAttendanceOfUser(requestId: number) {
    const request = await this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.attendance', 'attendance')
      .leftJoinAndSelect('attendance.user', 'user')
      .where('request.id = :requestId', {
        requestId: requestId,
      })
      .andWhere('request.status = :status', {
        status: RequestStatus.UNRESOLVED,
      })
      .getOne();

    if (!request) throw new Exception(ErrorCode.Attendance_Request_Not_Found);

    await this.requestRepository.update(requestId, {
      status: RequestStatus.DENIED,
    });

    return {
      message: 'success',
    };
  }

  private calculateTimeToHours(startTime: string, endTime: string): string {
    const currentTimeInSeconds = this.parseTimeToSeconds(startTime);
    const endTimeInSeconds = this.parseTimeToSeconds(endTime);
    const seconds = endTimeInSeconds - currentTimeInSeconds;
    if (seconds < 0) return '0';
    return this.formatTimeToHours(seconds);
  }

  private calculateTimeToMinutes(startTime: string, endTime: string): string {
    const currentTimeInSeconds = this.parseTimeToSeconds(startTime);
    const endTimeInSeconds = this.parseTimeToSeconds(endTime);
    const seconds = endTimeInSeconds - currentTimeInSeconds;
    if (seconds < 0) return '0';
    return this.formatTimeToMinutes(seconds);
  }

  private parseTimeToSeconds(timeString: string): number {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  }

  private formatTimeToMinutes(seconds: number): string {
    const minutes = Math.floor(seconds / 60);

    return `${minutes}`;
  }

  private formatTimeToHours(seconds: number): string {
    const hours = Math.floor(seconds / 3600);

    return `${hours}`;
  }

  private formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours}:${minutes}:${remainingSeconds}`;
  }

  // t1 < t2 --> return true
  private compareSmallerTime(time1: string, time2: string) {
    return this.parseTimeToSeconds(time1) < this.parseTimeToSeconds(time2);
  }
}
