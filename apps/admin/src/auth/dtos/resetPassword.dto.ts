import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: '123123', description: 'new password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}
