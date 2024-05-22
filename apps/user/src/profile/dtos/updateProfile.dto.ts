import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'nguyen' })
  firstName: string;

  @ApiProperty({ example: 'quang' })
  lastName: string;

  @ApiProperty({ example: '0123456789' })
  phoneNumber: string;

  @ApiProperty({ example: '29/02/1900' })
  dateOfBirth: string;
}
