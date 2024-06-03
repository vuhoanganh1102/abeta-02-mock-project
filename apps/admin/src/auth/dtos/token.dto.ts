import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenDto {
  @ApiProperty({ example: '123456', description: 'token embedded into link' })
  @IsNotEmpty()
  @IsString()
  token: string;
}
