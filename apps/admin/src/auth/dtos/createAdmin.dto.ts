import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ example: 'anh@' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'vu' })
  @IsNotEmpty()
  password: string;
}
