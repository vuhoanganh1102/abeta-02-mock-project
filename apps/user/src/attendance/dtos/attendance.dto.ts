import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AttendanceDto {
  @ApiProperty({ example: '2024-05-21' })
  @IsString()
  @IsNotEmpty()
  date: string;
}
