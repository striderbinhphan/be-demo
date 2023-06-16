import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from '../../entities';
import { FindManyOptions, Repository } from 'typeorm';
import { removeEmptyAndApplyTypeOrmOperator } from '../../shared/helpers';
import * as IMPORT_TOURNAMENTS from '../../../public/tournaments.json';
import { GetTournamentResponseDto, GetTournamentsInputDto } from './dto/tournament.dto';
import { PaginatedResponseDto } from '../../shared/pagination/paginated-response.dto';
@Injectable()
export class TournamentService implements OnModuleInit {
  private readonly logger: Logger = new Logger(TournamentService.name);
  constructor(@InjectRepository(Tournament) private tournamentRepo: Repository<Tournament>) {}
  async onModuleInit() {
    this.logger.log(`Starting seeding example Leagues ${new Date()}`);
    const isInitilized = await this.tournamentRepo.count();
    if (isInitilized) {
      this.logger.log(`Finish seeding example Leagues ${new Date()}`);
      return;
    }
    const data = IMPORT_TOURNAMENTS.map((e) =>
      this.tournamentRepo.create({
        uuid: e?.uuid,
        name: e?.name,
      }),
    );
    await this.tournamentRepo.save(data);
    this.logger.log(`Finish seeding example Leagues ${new Date()}`);
  }

  async findAll(
    filters: GetTournamentsInputDto,
  ): Promise<PaginatedResponseDto<GetTournamentResponseDto>> {
    const defaultSort = filters?.sort ? JSON.parse(filters.sort) : {};
    const { page, perpage, skip, name } = filters;
    const paramsFilter = removeEmptyAndApplyTypeOrmOperator(
      {
        name,
      },
      [],
    );
    const findManyOptions: FindManyOptions<Tournament> = {
      where: { ...paramsFilter },
      order: defaultSort,
      skip: skip,
      take: perpage,
    };
    const [tournaments, totalElements] = await Promise.all([
      this.tournamentRepo.find(findManyOptions),
      this.tournamentRepo.count(findManyOptions),
    ]);
    return new PaginatedResponseDto<GetTournamentResponseDto>(
      tournaments,
      page,
      perpage,
      totalElements,
    );
  }

  async findOne(tournamentUuid: string): Promise<Tournament> {
    const tournament = await this.tournamentRepo.findOne({
      where: {
        uuid: tournamentUuid,
      },
    });
    if (!tournament) {
      throw new BadRequestException('Invalid Tournament UUID');
    }
    return tournament;
  }
}
