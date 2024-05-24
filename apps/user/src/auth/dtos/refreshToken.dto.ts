import { ApiProperty } from '@nestjs/swagger';

export class refreshTokenDto {
  @ApiProperty({ example: '' })
  refreshToken: string;
}
