import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'quang@gmail.com', description: 'user email' })
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(20)
  email: string;

  @ApiProperty({ example: '123123', description: 'user password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
