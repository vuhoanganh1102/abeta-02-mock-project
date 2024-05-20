import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @ApiProperty({ example: '123123' })
  oldPassword: string;

  @ApiProperty({ example: '111111' })
  newPassword: string;
}
