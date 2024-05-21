import { ApiProperty } from '@nestjs/swagger';

export class AttendanceDto {
  @ApiProperty({ example: '2024-05-21' })
  date: string;
}
