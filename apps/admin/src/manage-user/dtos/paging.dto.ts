import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PagingDto {
  @ApiProperty({ example: 1, description: 'current page' })
  @IsNumber()
  @IsNotEmpty()
  pageIndex: number;

  @ApiProperty({ example: 10, description: 'number of records on a page' })
  @IsNumber()
  @IsNotEmpty()
  pageSize: number;
}
