import { AttendanceStatus, ErrorCode } from '@app/core/constants/enum';
import { Exception } from '@app/core/exception';
import { Attendance } from '@app/database-type-orm/entities/Attendance.entity';
import { CompanyConfig } from '@app/database-type-orm/entities/CompanyConfig.entity';
import { User } from '@app/database-type-orm/entities/User.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { format } from 'date-fns';
import { Between, Repository } from 'typeorm';
import { AttendanceRequestDto } from './dtos/attendanceRequest.dto';
import { OnesignalService } from '@app/onesignal/onesignal.service';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(CompanyConfig)
    private companyConfigRepository: Repository<CompanyConfig>,
    private onesignalService: OnesignalService,
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
      let lateTime;
      if (
        this.parseTimeToSeconds(format(new Date(), 'HH:mm:ss')) <
        this.parseTimeToSeconds(this.companyConfig.morningEndTime)
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.morningStartTime,
          format(new Date(), 'HH:mm:ss'),
        );
      } else {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.afternoonStartTime,
          format(new Date(), 'HH:mm:ss'),
        );
      }

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

      let workHours;
      if (
        this.parseTimeToSeconds(format(attendance.checkIn, 'HH:mm:ss')) <
        this.parseTimeToSeconds(this.companyConfig.morningEndTime)
      ) {
        const workHoursMorning = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        );

        const workHoursAfternoon = +this.calculateTimeToHours(
          this.companyConfig.afternoonStartTime,
          format(new Date(), 'HH:mm:ss'),
        );

        workHours = workHoursMorning + workHoursAfternoon;
      } else {
        const workHoursAfternoon = +this.calculateTimeToHours(
          format(attendance.checkIn, 'HH:mm:ss'),
          format(new Date(), 'HH:mm:ss'),
        );

        workHours = workHoursAfternoon;
      }
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
        // status: AttendanceStatus.PENDING,
      },
    });

    if (attendance && attendance.status !== AttendanceStatus.PENDING) {
      throw new Exception(ErrorCode.Attendance_Not_Found);
    }

    if (!attendance) {
      let lateTime, workHours;
      if (
        this.parseTimeToSeconds(
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        ) < this.parseTimeToSeconds(this.companyConfig.morningEndTime)
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.morningStartTime,
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        );

        const workHoursMorning = +this.calculateTimeToHours(
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        );

        const workHoursAfternoon = +this.calculateTimeToHours(
          this.companyConfig.afternoonStartTime,
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
        );

        workHours = workHoursMorning + workHoursAfternoon;
      } else {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.afternoonStartTime,
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        );
        const workHoursAfternoon = +this.calculateTimeToHours(
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
        );

        workHours = workHoursAfternoon;
      }

      await this.attendanceRepository.save({
        userId: userId,
        date: attendanceRequestDto.date,
        checkIn: attendanceRequestDto.checkIn,
        checkOut: attendanceRequestDto.checkOut,
        lateTime: lateTime,
        workHours: workHours,
        status: AttendanceStatus.PENDING,
      });
    }

    if (attendance && attendance.status === AttendanceStatus.PENDING) {
      let lateTime, workHours;
      if (
        this.parseTimeToSeconds(
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        ) < this.parseTimeToSeconds(this.companyConfig.morningEndTime)
      ) {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.morningStartTime,
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        );

        const workHoursMorning = +this.calculateTimeToHours(
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
          this.companyConfig.morningEndTime,
        );

        const workHoursAfternoon = +this.calculateTimeToHours(
          this.companyConfig.afternoonStartTime,
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
        );

        workHours = workHoursMorning + workHoursAfternoon;
      } else {
        lateTime = this.calculateTimeToMinutes(
          this.companyConfig.afternoonStartTime,
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
        );
        const workHoursAfternoon = +this.calculateTimeToHours(
          format(attendanceRequestDto.checkIn, 'HH:mm:ss'),
          format(attendanceRequestDto.checkOut, 'HH:mm:ss'),
        );

        workHours = workHoursAfternoon;
      }
      await this.attendanceRepository.update(attendance.id, {
        checkIn: attendanceRequestDto.checkIn,
        checkOut: attendanceRequestDto.checkOut,
        lateTime: lateTime,
        workHours: workHours,
        status: AttendanceStatus.PENDING,
      });
    }
    return { message: 'success' };
  }

  async getListAttendance(userId: number, month: string, year: string) {
    const startDate = `${year}-${month.padStart(2, '0')}-01`;
    const startDateObj = new Date(parseInt(year), parseInt(month), 1);
    const endDateString = startDateObj.toISOString().split('T')[0];

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
}
