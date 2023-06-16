import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInputDto } from '../../../shared/pagination/paginatio-input.dto';

export class CreateTeamDto {}

export class GetTeamResponseDto {
  @ApiProperty({
    type: String,
    required: true,
    description: '',
    example: '1',
  })
  uuid: string;

  @ApiProperty({
    type: String,
    required: true,
    description: '',
    example: 'Arsenal Football club',
  })
  name: string;

  @ApiProperty({
    type: String,
    required: true,
    description: '',
    example: '',
  })
  bannelUrl: string;
}

export class GetTeamsInputDto extends PaginationInputDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Team Name',
    example: '',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
