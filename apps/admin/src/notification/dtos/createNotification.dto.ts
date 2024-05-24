import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateNotificationDto {
  @ApiProperty({ example: 'Thông báo thưởng tiền' })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({ example: 'Cả công ty được thưởng 10 củ' })
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty({ example: '1', description: 'id người nhận' })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiProperty({
    example: '10:00:00',
    description: 'giờ gửi thông báo, format HH:MM:SS',
  })
  @IsNotEmpty()
  @IsString()
  time: string;

  @ApiProperty({
    example: '2024-05-23',
    description: 'ngày gửi thông báo, format YYYY-MM-DD',
  })
  @IsNotEmpty()
  @IsString()
  date: string;
}
export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {}
