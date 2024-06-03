import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    example: '123123',
    description: 'old password to authenticate',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    example: '111111',
    description: 'new password to change into',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
