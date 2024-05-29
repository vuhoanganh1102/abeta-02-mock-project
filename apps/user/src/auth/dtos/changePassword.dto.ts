import { ApiProperty } from '@nestjs/swagger';
import { IsAlphanumeric, IsNotEmpty, IsString, Length } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '123123' })
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(6, 10)
  oldPassword: string;

  @ApiProperty({ example: '111111' })
  @IsString()
  @IsAlphanumeric()
  @IsNotEmpty()
  @Length(6, 10)
  newPassword: string;
}
