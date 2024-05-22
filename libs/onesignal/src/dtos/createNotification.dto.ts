import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Important Notification' })
  title: string;

  @ApiProperty({ example: 'Notification Content' })
  content: string;

  @ApiProperty({ example: '2' })
  receiverId: number;
}
