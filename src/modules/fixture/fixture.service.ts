import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { removeEmptyAndApplyTypeOrmOperator } from '../../shared/helpers';
import { PaginatedResponseDto } from '../../shared/pagination/paginated-response.dto';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Fixture } from '../../entities';
import {
  CreateFixtureInputDto,
  GetFixtureResponseDto,
  GetFixturesCalendarInputDto,
  GetFixturesInputDto,
  UpdateFixtureInputDto,
} from './dto/fixture.dto';
import { TeamService } from '../team/team.service';
import { TournamentService } from '../tournament/tournament.service';
import { FixtureEventService } from './fixture-event.service';
import { EFixtureStatus } from '../../shared';
@Injectable()
export class FixtureService {
  private readonly logger: Logger = new Logger(FixtureService.name);
  constructor(
    @InjectRepository(Fixture) private fixtureRepo: Repository<Fixture>,
    @Inject(TeamService) private teamService: TeamService,
    @Inject(TournamentService) private tournamentService: TournamentService,
    @Inject(FixtureEventService) private fixtureEventService: FixtureEventService,
  ) {}

  async dateHasMaches({ fromDate, toDate }: GetFixturesCalendarInputDto): Promise<string[]> {
    const dayByDayFixtureCount = await this.fixtureRepo
      .createQueryBuilder()
      .select(['DATE(f.startDate) AS startDate', 'count("startDate") AS fixtureCount'])
      .from(Fixture, 'f')
      .where('f.startDate BETWEEN :fromDate AND :toDate', { fromDate, toDate })
      .groupBy('startDate')
      .orderBy('startDate', 'ASC')
      .getRawMany();
    return dayByDayFixtureCount.map((element: { startDate: string; fixtureCount: string }) =>
      new Date(element.startDate).toLocaleDateString('en-CA'),
    );
  }

  async findAll(filters: GetFixturesInputDto): Promise<PaginatedResponseDto<Fixture>> {
    const defaultSort = filters?.sort ? JSON.parse(filters.sort) : { startDate: 'DESC' };
    const { page, perpage, skip, tournamentUuid, fromDate, toDate } = filters;
    const paramsFilter = removeEmptyAndApplyTypeOrmOperator(
      {
        tournament: { uuid: tournamentUuid },
      },
      [],
    );
    const findManyOptions: FindManyOptions<Fixture> = {
      select: {
        uuid: true,
        homeTeam: {
          name: true,
          uuid: true,
          bannelUrl: true,
        },
        awayTeam: {
          name: true,
          uuid: true,
          bannelUrl: true,
        },
        tournament: {
          uuid: true,
          name: true,
        },
        homeScore: true,
        awayScore: true,
        startDate: true,
        endDate: true,
        status: true,
        createdAt: true,
      },
      relations: ['tournament', 'homeTeam', 'awayTeam'],
      where: {
        ...paramsFilter,
        ...(fromDate && toDate && { startDate: Between(fromDate as any, toDate as any) }),
      },
      order: defaultSort,
      skip: skip,
      take: perpage,
    };
    const [fixtures, totalElements] = await Promise.all([
      this.fixtureRepo.find(findManyOptions),
      this.fixtureRepo.count(findManyOptions),
    ]);
    return new PaginatedResponseDto<Fixture>(fixtures, page, perpage, totalElements);
  }

  async create({
    homeTeamUuid,
    awayTeamUuid,
    tournamentUuid,
    ...otherData
  }: CreateFixtureInputDto): Promise<Fixture> {
    try {
      if (homeTeamUuid === awayTeamUuid) {
        throw new BadRequestException('Home Team must be difference with Away Team');
      }
      const tournament = await this.tournamentService.findOne(tournamentUuid);
      const homeTeam = await this.teamService.findOne(homeTeamUuid);
      const awayTeam = await this.teamService.findOne(awayTeamUuid);
      const fixture = this.fixtureRepo.create({
        homeTeam,
        awayTeam,
        tournament,
        ...otherData,
      });
      await this.fixtureRepo.save(fixture);
      return fixture;
    } catch (err) {
      throw err;
    }
  }

  async update(
    fixtureUuid: string,
    { homeTeamUuid, awayTeamUuid, tournamentUuid, ...otherData }: UpdateFixtureInputDto,
  ): Promise<GetFixtureResponseDto> {
    const fixture = await this.fixtureRepo.findOne({
      select: {
        uuid: true,
        homeTeam: {
          name: true,
          uuid: true,
          bannelUrl: true,
        },
        awayTeam: {
          name: true,
          uuid: true,
          bannelUrl: true,
        },
        tournament: {
          uuid: true,
          name: true,
        },
        homeScore: true,
        awayScore: true,
        startDate: true,
        endDate: true,
        status: true,
      },
      relations: ['homeTeam', 'awayTeam', 'tournament'],
      where: {
        uuid: fixtureUuid,
      },
    });
    if (!fixture) {
      throw new BadRequestException('Invalid fixture UUID');
    }
    let updatedFixture = { ...fixture, ...otherData };
    if (homeTeamUuid) {
      const homeTeam = await this.teamService.findOne(homeTeamUuid);
      updatedFixture = { ...updatedFixture, ...{ homeTeam } };
    }
    if (awayTeamUuid) {
      const awayTeam = await this.teamService.findOne(awayTeamUuid);
      updatedFixture = { ...updatedFixture, ...{ awayTeam } };
    }
    if (tournamentUuid) {
      const tournament = await this.tournamentService.findOne(tournamentUuid);
      updatedFixture = { ...updatedFixture, ...{ tournament } };
    }
    await Promise.all([
      await this.fixtureRepo.save(updatedFixture),
      otherData.status === EFixtureStatus.LIVE &&
        (await this.fixtureEventService.emitEvent('fixture_updated', updatedFixture)),
    ]);
    return updatedFixture;
  }
}
