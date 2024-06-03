import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'nhtqung17@gmail.com',
    description: 'email used to login',
  })
  @MaxLength(50)
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123123', description: 'password used to login' })
  @MaxLength(50)
  @IsNotEmpty()
  password: string;
}
