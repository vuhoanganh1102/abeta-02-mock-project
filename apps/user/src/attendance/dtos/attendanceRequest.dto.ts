import { ApiProperty } from '@nestjs/swagger';

export class AttendanceRequestDto {
  @ApiProperty({ example: '2024-05-21' })
  date: string;

  @ApiProperty({ example: '2024-05-21 14:28:49 ' })
  checkIn: string;

  @ApiProperty({ example: '2024-05-21 14:28:49' })
  checkOut: string;
}
