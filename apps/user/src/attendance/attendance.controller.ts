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
import { ApiBearerAuth, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from './dtos/attendance.dto';
import { AttendanceRequestDto } from './dtos/attendanceRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiBearerAuth()
@ApiTags('Attendance')
@Controller('user')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('attendance/create')
  recordAttendance(@AuthUser() { id }) {
    return this.attendanceService.recordAttendance(+id);
  }

  @Post('attendance/request')
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

  @Get('attendance/request')
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

  @Post('attendance')
  getAttendance(@AuthUser() { id }, @Body() { date }: AttendanceDto) {
    return this.attendanceService.getAttendance(+id, date);
  }

  @Get('attendance/get_list')
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
