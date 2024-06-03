import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgotPasswordDto {
  @ApiProperty({
    example: 'quang@gmail.com',
    description: 'email to receive reset password link',
  })
  @IsEmail()
  email: string;
}
