import { ApiProperty } from '@nestjs/swagger';

export class AttendanceRequestDto {
  @ApiProperty({ example: '2024-05-21' })
  date: string;

  @ApiProperty({ example: '2024-05-21 ' })
  checkIn: string;

  @ApiProperty({ example: '2024-05-21' })
  checkOut: string;
}
