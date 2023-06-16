import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Team } from '../../entities';
import { GetTeamResponseDto, GetTeamsInputDto } from './dto/team.dto';
import { PaginatedResponseDto } from '../../shared/pagination/paginated-response.dto';
import { removeEmptyAndApplyTypeOrmOperator } from '../../shared/helpers';
import * as IMPORTED_TEAMS from '../../../public/teams.json';

@Injectable()
export class TeamService implements OnModuleInit {
  private readonly logger: Logger = new Logger(TeamService.name);
  constructor(@InjectRepository(Team) private teamRepo: Repository<Team>) {}
  async onModuleInit() {
    this.logger.log(`Starting seeding example Leagues ${new Date()}`);
    const isInitilized = await this.teamRepo.count();
    if (isInitilized) {
      this.logger.log(`Finish seeding example Leagues ${new Date()}`);
      return;
    }
    const data = IMPORTED_TEAMS.map((e) =>
      this.teamRepo.create({
        uuid: e?.uuid,
        name: e?.shortName,
        bannelUrl: e?.imageUrl,
      }),
    );
    await this.teamRepo.save(data);
    this.logger.log(`Finish seeding example Leagues ${new Date()}`);
  }

  async findAll(filters: GetTeamsInputDto): Promise<PaginatedResponseDto<GetTeamResponseDto>> {
    const defaultSort = filters?.sort ? JSON.parse(filters.sort) : {};
    const { page, perpage, skip, name } = filters;
    const paramsFilter = removeEmptyAndApplyTypeOrmOperator(
      {
        name,
      },
      [],
    );
    const findManyOptions: FindManyOptions<Team> = {
      where: { ...paramsFilter },
      order: defaultSort,
      skip: skip,
      take: perpage,
    };
    const [teams, totalElements] = await Promise.all([
      this.teamRepo.find(findManyOptions),
      this.teamRepo.count(findManyOptions),
    ]);
    return new PaginatedResponseDto<GetTeamResponseDto>(teams, page, perpage, totalElements);
  }

  async findOne(teamUuid: string): Promise<Team> {
    const team = await this.teamRepo.findOne({
      where: {
        uuid: teamUuid,
      },
    });
    if (!team) {
      throw new BadRequestException('Invalid Team UUID');
    }
    return team;
  }
}
