import { LowerCase, Trim } from '@app/core/validate';
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class ForgetPasswordDto {
  @ApiProperty({ example: 'quang@gmail.com' })
  @Trim()
  @LowerCase()
  @IsEmail()
  email: string;
}
