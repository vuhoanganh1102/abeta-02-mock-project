import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AttendanceRequestPageDto } from './dtos/attendanceRequestPage.dto';
import { AttendanceRequestDto } from './dtos/attendanceRequest.dto';
import { AuthAdmin } from '@app/core/decorators/authAdmin.decorator';

@ApiBearerAuth()
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('today')
  @ApiOperation({
    summary: 'Get all attendance records for today',
  })
  getListAttendanceToday(
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.attendanceService.getListAttendanceToday(pageIndex, pageSize);
  }

  @Get('specific-day')
  @ApiOperation({
    summary: 'get all attendance records in a specific day',
    description:
      'insert a day (format YYYY-MM-DD) to see all attendance records in that day',
  })
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

  @Get('get-one/:id')
  @ApiOperation({
    summary: 'get an attendance record',
    description: 'insert attendance id to see all details of that attendance',
  })
  getOneAttendance(@Param('id') id: number) {
    return this.attendanceService.getOneAttendance(id);
  }

  @Get('user/:id')
  @ApiOperation({
    summary: 'get all attendance records of a user with time filter',
    description:
      'insert user id and timeline to see a list of attendance record',
  })
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
    @Query('pageIndex') pageIndex: number,
    @Query('pageSize') pageSize: number,
  ) {
    return this.attendanceService.getListAttendanceOfUser(
      start,
      end,
      id,
      pageIndex,
      pageSize,
    );
  }

  @Post('request')
  @ApiOperation({
    summary: 'get list attendance change requests received by admin',
  })
  getListRequestAttendanceOfUser(
    @AuthAdmin() { id },
    @Body() attendanceRequestPageDto: AttendanceRequestPageDto,
  ) {
    return this.attendanceService.getListRequestAttendanceOfUser(
      id,
      attendanceRequestPageDto,
    );
  }

  @ApiOperation({
    summary: 'accept an attendance change request from user',
    description: 'set the status for that request into Approved',
  })
  @Post('request/accept')
  acceptRequestAttendanceOfUser(@Body() { requestId }: AttendanceRequestDto) {
    return this.attendanceService.acceptRequestAttendanceOfUser(requestId);
  }

  @ApiOperation({
    summary: 'reject an attendance change request from user',
    description: 'set the status for that request into Denied',
  })
  @Post('request/reject')
  rejectRequestAttendanceOfUser(@Body() { requestId }: AttendanceRequestDto) {
    return this.attendanceService.rejectRequestAttendanceOfUser(requestId);
  }
}
