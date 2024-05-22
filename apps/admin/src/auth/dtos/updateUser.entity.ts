import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'anh' })
  @IsOptional()
  lastName: string;

  @ApiProperty({ example: 'vu' })
  @IsOptional()
  firstName: string;

  @ApiProperty({ example: '19-08-2000' })
  @IsOptional()
  dateOfBirth: string;

  @ApiProperty({ example: '0000000' })
  @IsOptional()
  phoneNumber: string;

  @ApiProperty({ example: 'url' })
  @IsOptional()
  avatar: string;

  @ApiProperty({ example: 0 })
  @IsOptional()
  isVerified: number;
}
