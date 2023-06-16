import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpStatus,
  Put,
  Query,
  Sse,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../shared/pagination/paginated-response.dto';
import {
  CreateFixtureInputDto,
  GetFixtureResponseDto,
  GetFixturesCalendarInputDto,
  GetFixturesInputDto,
  UpdateFixtureInputDto,
} from './dto/fixture.dto';
import { FixtureEventService } from './fixture-event.service';
import { FixtureService } from './fixture.service';

@Controller('fixtures')
@ApiTags('Fixtures Listing')
export class FixtureController {
  constructor(
    private readonly fixtureService: FixtureService,
    private readonly fixtureEventService: FixtureEventService,
  ) {}
  @Sse('realtime')
  events(@Req() req: Express.Request) {
    return this.fixtureEventService.subscribeUpdatedFixtureEvent();
  }

  @Get('calendar')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: [String],
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: Error,
  })
  async dateHasMaches(@Query() data: GetFixturesCalendarInputDto): Promise<string[]> {
    return this.fixtureService.dateHasMaches(data);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: PaginatedResponseDto<GetFixtureResponseDto>,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: Error,
  })
  async findAll(
    @Query() filters: GetFixturesInputDto,
  ): Promise<PaginatedResponseDto<GetFixtureResponseDto>> {
    return this.fixtureService.findAll(filters);
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GetFixtureResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: Error,
  })
  async create(
    @Body() createFixtureInputDto: CreateFixtureInputDto,
  ): Promise<GetFixtureResponseDto> {
    return this.fixtureService.create(createFixtureInputDto);
  }

  @Put(':fixtureUuid')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ok',
    type: GetFixtureResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: Error,
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal Server Error',
    type: Error,
  })
  async update(
    @Param('fixtureUuid') fixtureUuid: string,
    @Body() updateFixtureDto: UpdateFixtureInputDto,
  ): Promise<GetFixtureResponseDto> {
    return this.fixtureService.update(fixtureUuid, updateFixtureDto);
  }
}
