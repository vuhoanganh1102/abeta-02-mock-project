import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({ example: '123123' })
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(6, 10)
  password: string;
}
