import { ApiProperty } from '@nestjs/swagger';

export class PageSizeDto {
  @ApiProperty()
  pageIndex: number;

  @ApiProperty()
  pageSize: number;

  skip?: number;

  @ApiProperty()
  keyword?: string;
}

export class LoadMoreDto {
  takeAfter: string;

  @ApiProperty()
  pageSize: number;

  @ApiProperty()
  keyword?: string;
}
