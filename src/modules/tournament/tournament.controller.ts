import { Controller, Get, Param, HttpStatus, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../shared/pagination/paginated-response.dto';
import { GetTournamentResponseDto, GetTournamentsInputDto } from './dto/tournament.dto';
import { TournamentService } from './tournament.service';

@Controller('tournaments')
@ApiTags('Tournament')
export class TournamentController {
  constructor(private readonly tournamentService: TournamentService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: PaginatedResponseDto<GetTournamentResponseDto>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: Error,
  })
  async findAll(
    @Query() filters: GetTournamentsInputDto,
  ): Promise<PaginatedResponseDto<GetTournamentResponseDto>> {
    return this.tournamentService.findAll(filters);
  }

  @Get(':tournamenUuid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GetTournamentResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: Error,
  })
  findOne(@Param('tournamenUuid') tournamenUuid: string): Promise<GetTournamentResponseDto> {
    return this.tournamentService.findOne(tournamenUuid);
  }
}
