import { ApiProperty } from '@nestjs/swagger';
import { Allow, IsNotEmpty, IsString } from 'class-validator';

export class AttendanceRequestDto {
  @ApiProperty({ example: '2024-05-21' })
  @IsString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: 'Yêu cầu sửa chấm công' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Yêu cầu sửa chấm công' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '2024-05-21 14:28:49' })
  @IsString()
  @IsNotEmpty()
  checkIn: string;

  @ApiProperty({ example: '2024-05-21 14:28:49' })
  @IsString()
  @IsNotEmpty()
  checkOut: string;

  @ApiProperty({ required: false, type: 'file' })
  @Allow()
  file: any;
}
