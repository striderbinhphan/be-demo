import { Controller, Get, Param, HttpStatus, Query } from '@nestjs/common';
import { TeamService } from './team.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../shared/pagination/paginated-response.dto';
import { GetTeamResponseDto, GetTeamsInputDto } from './dto/team.dto';

@Controller('teams')
@ApiTags('Teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: PaginatedResponseDto<GetTeamResponseDto>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: Error,
  })
  async findAll(
    @Query() filters: GetTeamsInputDto,
  ): Promise<PaginatedResponseDto<GetTeamResponseDto>> {
    return this.teamService.findAll(filters);
  }

  @Get(':teamUuid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GetTeamResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: Error,
  })
  findOne(@Param('teamUuid') teamUuid: string): Promise<GetTeamResponseDto> {
    return this.teamService.findOne(teamUuid);
  }
}
