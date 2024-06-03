import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'nguyen', description: 'user first name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  firstName: string;

  @ApiProperty({ example: 'quang', description: 'user last name' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  lastName: string;

  @ApiProperty({
    example: '0123456789',
    description: 'user unique phone number',
  })
  @IsString()
  @IsNotEmpty()
  @ArrayUnique()
  @MaxLength(12)
  phoneNumber: string;

  @ApiProperty({ example: '29/02/1900', description: 'user date of birth' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(11)
  dateOfBirth: string;
}
