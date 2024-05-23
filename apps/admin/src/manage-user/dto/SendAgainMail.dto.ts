import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class Obj {
  @IsEmail()
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  receiver: string;
  @ApiProperty({ example: 'anhvh1102@gmail.com' })
  subject: string;
  @ApiProperty({ example: 'verify' })
  templateName: string;
}
