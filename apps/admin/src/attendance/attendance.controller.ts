import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { Public } from '@app/jwt-authentication/jwt-authentication.decorator';
import { AuthAdmin } from '@app/jwt-authentication/admin.decorator';
import { AttendanceRequestPageDto } from './dtos/attendanceRequestPage.dto';
import { AttendanceRequestDto } from './dtos/attendanceRequest.dto';

@ApiBearerAuth()
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  getListAttendanceToday() {
    return this.attendanceService.getListAttendanceToday();
  }

  @Public()
  @Get('specific-day')
  @ApiQuery({
    name: 'date',
    type: String,
    required: true,
    example: '2024-05-22',
    description: 'YYYY-MM-DD',
  })
  getListAttendanceInADay(@Query('date') date: string) {
    return this.attendanceService.getListAttendanceInADay(date);
  }

  @Public()
  @Get('get-one/:id')
  getOneAttendance(@Param('id') id: number) {
    return this.attendanceService.getOneAttendance(id);
  }

  @Public()
  @Get('user/:id')
  @ApiQuery({
    name: 'start-date',
    type: String,
    required: true,
    example: '2024-05-22',
    description: 'YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'end-date',
    type: String,
    required: true,
    example: '2024-05-22',
    description: 'YYYY-MM-DD',
  })
  @ApiQuery({
    name: 'id',
    type: String,
    required: false,
    example: '1',
    description: 'user_id',
  })
  getListAttendanceOfUser(
    // @Param('id') id: number,
    @Query('start-date') start: string,
    @Query('end-date') end: string,
    @Query('id') id: number,
  ) {
    return this.attendanceService.getListAttendanceOfUser(start, end, id);
  }

  @Post('request')
  getListRequestAttendanceOfUser(
    @AuthAdmin() { id },
    @Body() attendanceRequestPageDto: AttendanceRequestPageDto,
  ) {
    return this.attendanceService.getListRequestAttendanceOfUser(
      id,
      attendanceRequestPageDto,
    );
  }

  @Post('request/accept')
  acceptRequestAttendanceOfUser(@Body() { requestId }: AttendanceRequestDto) {
    return this.attendanceService.acceptRequestAttendanceOfUser(requestId);
  }

  @Post('request/reject')
  rejectRequestAttendanceOfUser(@Body() { requestId }: AttendanceRequestDto) {
    return this.attendanceService.rejectRequestAttendanceOfUser(requestId);
  }
}
