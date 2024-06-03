import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({ example: 'quang@gmail.com' })
  @IsEmail()
  email: string;
}
