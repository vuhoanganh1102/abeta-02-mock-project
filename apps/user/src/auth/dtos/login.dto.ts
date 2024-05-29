import { LowerCase, Trim } from '@app/core/validate';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsAlphanumeric,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
} from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ example: 'tien@gmail.com' })
  @Trim()
  @LowerCase()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123123' })
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(6, 10)
  password: string;
}
