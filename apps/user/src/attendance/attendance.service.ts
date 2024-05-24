import {
  AttendanceStatus,
  ErrorCode,
  RequestStatus,
} from '@app/core/constants/enum';
import { Exception } from '@app/core/exception';
import { Attendance } from '@app/database-type-orm/entities/Attendance.entity';
import { CompanyConfig } from '@app/database-type-orm/entities/CompanyConfig.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Repository } from 'typeorm';
import { AttendanceRequestDto } from './dtos/attendanceRequest.dto';
import { Request } from '@app/database-type-orm/entities/Request.entity';
import { RequestAdmin } from '@app/database-type-orm/entities/RequestAdmin.entity';
import { FirebaseUploadService } from '@app/firebase-upload';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Request)
    private requestRepository: Repository<Request>,
    @InjectRepository(RequestAdmin)
    private requestAdminRepository: Repository<RequestAdmin>,
    @InjectRepository(CompanyConfig)
    private companyConfigRepository: Repository<CompanyConfig>,
    private firebaseUploadService: FirebaseUploadService,
  ) {}

  private companyConfig = {
    morningStartTime: '08:00:00',
    morningEndTime: '12:00:00',
    afternoonStartTime: '13:30:00',
    afternoonEndTime: '17:30:00',
    endTime: '22:00:00',
  };

  async recordAttendance(userId: number) {
    if (
      this.parseTimeToSeconds(format(new Date(), 'HH:mm:ss')) >
      this.parseTimeToSeconds(this.companyConfig.endTime)
    ) {
      throw new Exception(ErrorCode.Exceeded_Time_Attendance);
    }
    const date = format(new Date(), 'yyyy-MM-dd');
    const attendance = await this.attendanceRepository.findOne({
      where: { userId: userId, date: date },
    });

    if (!attendance) {
      const checkIn = new Date();
      let lateTime;
      if (
        this.compareSmallerTime(
          format(checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        )
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.morningStartTime,
          format(checkIn, 'HH:mm:ss'),
        );
      } else {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.afternoonStartTime,
          format(checkIn, 'HH:mm:ss'),
        );
      }

      await this.attendanceRepository.save({
        userId: userId,
        date: date,
        checkIn: format(checkIn, 'yyyy-MM-dd HH:mm:ss'),
        lateTime: lateTime,
        status: AttendanceStatus.PENDING,
      });

      return {
        userId: userId,
        date: date,
        checkIn: format(checkIn, 'yyyy-MM-dd HH:mm:ss'),
        lateTime: lateTime,
      };
    }

    if (attendance && attendance.status === AttendanceStatus.PENDING) {
      const checkOut = new Date();
      let workHours;

      if (
        this.compareSmallerTime(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        ) &&
        this.compareSmallerTime(
          format(checkOut, 'HH:mm:ss'),
          this.companyConfig.afternoonStartTime,
        )
      ) {
        const workHoursMorning = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          format(checkOut, 'HH:mm:ss'),
        );
        workHours = workHoursMorning;
      }

      if (
        this.compareSmallerTime(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        ) &&
        !this.compareSmallerTime(
          format(checkOut, 'HH:mm:ss'),
          this.companyConfig.afternoonStartTime,
        )
      ) {
        const workHoursMorning = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        );
        const workHoursAfternoon = +this.calculateTimeToHours(
          this.companyConfig.afternoonStartTime,
          format(checkOut, 'HH:mm:ss'),
        );

        workHours = workHoursMorning + workHoursAfternoon;
      }

      if (
        !this.compareSmallerTime(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        )
      ) {
        const workHoursAfternoon = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          format(checkOut, 'HH:mm:ss'),
        );
        workHours = workHoursAfternoon;
      }

      await this.attendanceRepository.update(attendance.id, {
        userId: userId,
        checkOut: format(checkOut, 'yyyy-MM-dd HH:mm:ss'),
        workHours: workHours,
        status: AttendanceStatus.ACTIVE,
      });

      return {
        userId: userId,
        checkOut: format(checkOut, 'yyyy-MM-dd HH:mm:ss'),
        workHours: workHours,
      };
    }

    throw new Exception(ErrorCode.CheckOut_Already_Exists);
  }

  async getAttendance(userId: number, date: string) {
    const attendance = await this.attendanceRepository.findOne({
      where: { userId: userId, date: date },
    });
    if (!attendance) throw new Exception(ErrorCode.Attendance_Not_Found);
    return attendance;
  }

  async requestAttendance(
    userId: number,
    file,
    attendanceRequestDto: AttendanceRequestDto,
  ) {
    const attendance = await this.attendanceRepository.findOne({
      where: {
        userId: userId,
        date: attendanceRequestDto.date,
      },
    });

    let imageUrl;
    if (file) {
      imageUrl = await this.firebaseUploadService.uploadSingleImage(file);
    }

    let attendanceId;

    if (!attendance) {
      let lateTime, workHours;
      if (
        this.compareSmallerTime(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        ) &&
        this.compareSmallerTime(
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
          this.companyConfig.afternoonStartTime,
        )
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.morningStartTime,
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        );
        const workHoursMorning = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
        );
        workHours = workHoursMorning;
      }

      if (
        this.compareSmallerTime(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        ) &&
        !this.compareSmallerTime(
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
          this.companyConfig.afternoonStartTime,
        )
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.morningStartTime,
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        );
        const workHoursMorning = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        );
        const workHoursAfternoon = +this.calculateTimeToHours(
          this.companyConfig.afternoonStartTime,
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
        );

        workHours = workHoursMorning + workHoursAfternoon;
      }

      if (
        !this.compareSmallerTime(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        )
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.afternoonStartTime,
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        );
        const workHoursAfternoon = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
        );
        workHours = workHoursAfternoon;
      }

      const result = await this.attendanceRepository.save({
        userId: userId,
        date: attendanceRequestDto.date,
        checkIn: attendanceRequestDto.checkIn,
        checkOut: attendanceRequestDto.checkOut,
        lateTime: lateTime,
        workHours: workHours,
        status: AttendanceStatus.PENDING,
      });

      attendanceId = result.id;
    }

    if (attendance && attendance.status === AttendanceStatus.PENDING) {
      attendanceId = attendance.id;
    }

    const request = await this.requestRepository.save({
      title: attendanceRequestDto.title,
      content: attendanceRequestDto.content,
      attendanceId: attendanceId,
      imageUrl: imageUrl,
      status: RequestStatus.UNRESOLVED,
      checkIn: attendanceRequestDto.checkIn,
      checkOut: attendanceRequestDto.checkOut,
    });

    await this.requestAdminRepository.save({
      requestId: request.id,
      adminId: 1,
    });

    return { message: 'success' };
  }

  async getListRequestAttendance(userId: number, month: string, year: string) {
    const startDate = `${year}-${month.padStart(2, '0')}-01 00:00:00.000000`;
    const endDateObj = new Date(parseInt(year), parseInt(month), 1);
    const endDateString =
      endDateObj.toISOString().split('T')[0] + ' 23:59:59.000000';

    return await this.requestRepository
      .createQueryBuilder('request')
      .leftJoinAndSelect('request.attendance', 'attendance')
      .where('attendance.userId = :userId', { userId })
      .andWhere('request.created_at BETWEEN :startDate AND :endDate', {
        startDate,
        endDate: endDateString,
      })
      .getMany();
  }

  async getListAttendance(userId: number, month: string, year: string) {
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const endDateObj = new Date(parseInt(year), parseInt(month), 1);
    const endDateString = endDateObj.toISOString().split('T')[0];

    return await this.attendanceRepository
      .createQueryBuilder('attendance')
      .where('attendance.userId = :userId', { userId })
      .andWhere('attendance.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate: endDateString,
      })
      .getMany();
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
