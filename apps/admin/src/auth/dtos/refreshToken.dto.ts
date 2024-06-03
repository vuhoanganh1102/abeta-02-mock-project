import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    example: '12345',
    description: 'refresh token received when login',
  })
  @IsNotEmpty()
  refreshToken: string;
}
