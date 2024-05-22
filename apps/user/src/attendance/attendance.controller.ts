import { AuthUser } from '@app/core/decorators/user.decorator';
import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from './dtos/attendance.dto';
import { AttendanceRequestDto } from './dtos/attendanceRequest.dto';

@ApiBearerAuth()
@ApiTags('Attendance')
@Controller('user')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('attendance/create')
  async recordAttendance(@AuthUser() { id }) {
    return this.attendanceService.recordAttendance(+id);
  }

  @Post('attendance/request')
  async requestAttendance(
    @AuthUser() { id },
    @Body() attendanceRequestDto: AttendanceRequestDto,
  ) {
    return this.attendanceService.requestAttendance(+id, attendanceRequestDto);
  }

  @Post('attendance')
  async getAttendance(@AuthUser() { id }, @Body() { date }: AttendanceDto) {
    return this.attendanceService.getAttendance(+id, date);
  }
}
