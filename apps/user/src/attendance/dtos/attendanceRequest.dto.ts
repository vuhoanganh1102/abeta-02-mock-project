import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

export class AttendanceRequestDto {
  @ApiProperty({ example: '2024-05-21' })
  date: string;

  @ApiProperty({ example: 'Yêu cầu sửa chấm công' })
  title: string;

  @ApiProperty({ example: 'Yêu cầu sửa chấm công' })
  content: string;

  @ApiProperty({ example: '2024-05-21 14:28:49 ' })
  checkIn: string;

  @ApiProperty({ example: '2024-05-21 14:28:49' })
  checkOut: string;

  @ApiProperty({ required: false, type: 'file' })
  @Allow()
  file: any;
}
