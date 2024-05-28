import { AuthUser } from '@app/core/decorators/authUser.decorator';
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {ApiBearerAuth, ApiConsumes, ApiOperation, ApiQuery, ApiTags} from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from './dtos/attendance.dto';
import { AttendanceRequestDto } from './dtos/attendanceRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @ApiOperation({
    summary: 'Create a new attendance',
    description: 'User creates a new attendance for today'
  })
  @Post('create')
  recordAttendance(@AuthUser() { id }) {
    return this.attendanceService.recordAttendance(+id);
  }

  @ApiOperation({
    summary: 'Create a new request to change attendance details after 24 hours',
    description: 'User creates a new request. This request will be sent to admin'
  })
  @Post('request')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  requestAttendance(
    @AuthUser() { id },
    @Body() attendanceRequestDto: AttendanceRequestDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.attendanceService.requestAttendance(
      +id,
      file,
      attendanceRequestDto,
    );
  }

  @ApiOperation({
    summary: 'See all requests in a month',
    description: 'Insert month/year to see all request in that month'
  })
  @Get('request')
  @ApiQuery({
    name: 'month',
    required: true,
    type: Number,
    description: 'Month of the request attendance',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    type: Number,
    description: 'Year of the request attendance',
  })
  getListRequestAttendance(
    @AuthUser() { id },
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.attendanceService.getListRequestAttendance(+id, month, year);
  }

  @ApiOperation({
    summary: 'See all requests in a month',
    description: 'Insert month/year to see all request in that month'
  })
  @Post('get-one')
  getAttendance(@AuthUser() { id }, @Body() { date }: AttendanceDto) {
    return this.attendanceService.getAttendance(+id, date);
  }

  @ApiOperation({
    summary: 'See all attendance records in a month',
    description: 'Insert month/year to see list of all attendance records in that month'
  })
  @Get('get-list')
  @ApiQuery({
    name: 'month',
    required: true,
    type: Number,
    description: 'Month of the attendance',
  })
  @ApiQuery({
    name: 'year',
    required: true,
    type: Number,
    description: 'Year of the attendance',
  })
  getListAttendance(
    @AuthUser() { id },
    @Query('month') month: string,
    @Query('year') year: string,
  ) {
    return this.attendanceService.getListAttendance(+id, month, year);
  }
}
