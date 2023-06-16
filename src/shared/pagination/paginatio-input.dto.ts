import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsJSON, IsNumber, IsOptional } from 'class-validator';
import { sortParamsExample } from '../contants';

export abstract class PaginationInputDto {
  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  perpage?: number;

  @ApiProperty({
    type: 'json',
    required: false,
    name: 'sort',
    example: sortParamsExample,
  })
  @IsOptional()
  @IsJSON()
  sort?: any;

  get skip(): number {
    return ((this.page as number) - 1) * (this.perpage as number);
  }
}
