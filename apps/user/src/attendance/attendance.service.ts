import { AttendanceStatus, ErrorCode } from '@app/core/constants/enum';
import { Exception } from '@app/core/exception';
import { Attendance } from '@app/database-type-orm/entities/Attendance.entity';
import { CompanyConfig } from '@app/database-type-orm/entities/CompanyConfig.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Repository } from 'typeorm';
import { AttendanceRequestDto } from './dtos/attendanceRequest.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(CompanyConfig)
    private companyConfigRepository: Repository<CompanyConfig>,
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
      const checkIn = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
      const lateTimeMorning = this.calculateTimeToMinutes(
        this.companyConfig.morningStartTime,
        format(new Date(), 'HH:mm:ss'),
      );

      const lateTimeAfternoon = this.calculateTimeToMinutes(
        this.companyConfig.morningStartTime,
        format(new Date(), 'HH:mm:ss'),
      );

      const lateTime = Math.max(+lateTimeMorning, +lateTimeAfternoon);

      await this.attendanceRepository.save({
        userId: userId,
        date: date,
        checkIn: checkIn,
        lateTime: lateTime,
        status: AttendanceStatus.PENDING,
      });

      return {
        userId: userId,
        date: date,
        checkIn: checkIn,
        lateTime: lateTime,
      };
    }

    if (attendance && attendance.status === AttendanceStatus.PENDING) {
      const checkOut = format(new Date(), 'yyyy-MM-dd HH:mm:ss');

      const workHoursMorning = this.calculateTimeToHours(
        format(attendance.checkIn, 'HH:mm:ss'),
        this.companyConfig.morningEndTime,
      );
      let workHoursAfternoon;
      if (
        this.parseTimeToSeconds(format(attendance.checkIn, 'HH:mm:ss')) >
        this.parseTimeToSeconds(this.companyConfig.morningEndTime)
      ) {
        workHoursAfternoon = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.afternoonEndTime,
        );
      } else {
        workHoursAfternoon = +this.calculateTimeToHours(
          this.companyConfig.afternoonStartTime,
          this.companyConfig.afternoonEndTime,
        );
      }

      const workHours = +workHoursMorning + workHoursAfternoon;

      await this.attendanceRepository.update(attendance.id, {
        userId: userId,
        checkOut: checkOut,
        workHours: workHours,
        status: AttendanceStatus.ACTIVE,
      });

      return {
        userId: userId,
        checkOut: checkOut,
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
    attendanceRequestDto: AttendanceRequestDto,
  ) {
    const attendance = await this.attendanceRepository.findOne({
      where: {
        userId: userId,
        date: attendanceRequestDto.date,
        status: AttendanceStatus.PENDING,
      },
    });

    if (!attendance) throw new Exception(ErrorCode.Attendance_Not_Found);
    await this.attendanceRepository.update(attendance.id, {
      checkIn: attendanceRequestDto.checkIn,
      checkOut: attendanceRequestDto.checkOut,
      status: AttendanceStatus.PENDING,
    });

    return { message: 'success' };
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
}
