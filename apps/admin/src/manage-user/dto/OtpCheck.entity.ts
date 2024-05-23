import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class otp {
  @IsEmail()
  @ApiProperty({ example: 'accofcod1102@gmail.com' })
  email: string;
  @ApiProperty({ example: 'otp' })
  otp: string;
}
