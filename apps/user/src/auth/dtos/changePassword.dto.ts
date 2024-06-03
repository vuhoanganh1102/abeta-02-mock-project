import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: '123123' })
  oldPassword: string;

  @ApiProperty({ example: '111111' })
  @IsStrongPassword()
  newPassword: string;
}
