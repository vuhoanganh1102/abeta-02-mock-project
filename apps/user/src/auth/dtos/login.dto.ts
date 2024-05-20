import { ApiProperty } from '@nestjs/swagger';

export class LoginAuthDto {
  @ApiProperty({ example: 'tien@gmail.com' })
  email: string;

  @ApiProperty({ example: '123123' })
  password: string;
}
