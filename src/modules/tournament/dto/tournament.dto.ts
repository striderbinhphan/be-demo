import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationInputDto } from '../../../shared/pagination/paginatio-input.dto';

export class GetTournamentResponseDto {
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
    example: '',
  })
  name: string;
}

export class GetTournamentsInputDto extends PaginationInputDto {
  @ApiProperty({
    type: String,
    required: false,
    description: 'Tournament Name',
    example: '',
  })
  @IsString()
  @IsOptional()
  name?: string;
}
