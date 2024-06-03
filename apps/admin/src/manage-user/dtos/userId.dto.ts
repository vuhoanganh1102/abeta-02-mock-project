import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class UserIdDto {
  @ApiProperty({ example: 1, description: 'id of an user' })
  @IsNumber()
  @IsNotEmpty()
  id: number;
}
