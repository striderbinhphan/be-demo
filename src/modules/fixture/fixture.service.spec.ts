import { Test, TestingModule } from '@nestjs/testing';
import { Fixture } from '../../entities';
import { Repository } from 'typeorm';
import { FixtureService } from './fixture.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TeamService } from '../team/team.service';
import { TournamentService } from '../tournament/tournament.service';
import { FixtureEventService } from './fixture-event.service';
import { DateHasMachesDBMock, FixtureDbMock } from './mocks/fixture.mock';
import {
  CreateFixtureInputDto,
  GetFixturesInputDto,
  UpdateFixtureInputDto,
} from './dto/fixture.dto';
import * as helpers from '../../shared/helpers';
describe('FixtureService', () => {
  let service: FixtureService;
  let fixtureRepo: Repository<Fixture>;
  const fixtureRepoMock = {
    find: jest.fn(),
    count: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
  };
  const teamServiceMock = {
    findOne: jest.fn(),
  };
  const tournamentServiceMock = {
    findOne: jest.fn(),
  };
  const fixtureEventServiceMock = {};
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FixtureService,
        {
          provide: getRepositoryToken(Fixture),
          useValue: fixtureRepoMock,
        },
        {
          provide: TeamService,
          useValue: teamServiceMock,
        },
        {
          provide: TournamentService,
          useValue: tournamentServiceMock,
        },
        {
          provide: FixtureEventService,
          useValue: fixtureEventServiceMock,
        },
      ],
    }).compile();

    service = module.get<FixtureService>(FixtureService);
    fixtureRepo = module.get<Repository<Fixture>>(getRepositoryToken(Fixture));
  });

  // reset call counts and called with arguments after each spec
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('findAll', () => {
    it('happy case', async () => {
      // prepare mock data
      const listFixtureResponseMock = [FixtureDbMock];
      const filtersMock: GetFixturesInputDto = {
        page: 1,
        perpage: 20,
        skip: undefined,
      };
      // create a spy for the removeEmptyAndApplyTypeOrmOperator helper method
      const spyApplyTypeormOperator = jest.spyOn(helpers, 'removeEmptyAndApplyTypeOrmOperator');
      spyApplyTypeormOperator.mockReturnValue({});
      // create a spy for the repository find method
      fixtureRepoMock.find.mockResolvedValue(listFixtureResponseMock);
      // create a spy for the repository count method
      fixtureRepoMock.count.mockResolvedValue(1);

      // action
      const result = await service.findAll(filtersMock);

      // assert
      expect(spyApplyTypeormOperator).toBeCalled();
      expect(fixtureRepoMock.find).toBeCalled();
      expect(fixtureRepoMock.count).toBeCalled();
      expect(result.totalElements).toBe(listFixtureResponseMock.length);
      expect(result.data[0].uuid).toBe(FixtureDbMock.uuid);
    });
  });
  // describe('dateHasMaches', () => {
  //   it('happy case', async () => {
  //     // prepare mock data
  //     const dateHasMachesDBMock = [{ startDate: '2023-01-13', fixtureCount: 1 }];
  //     // create a spy for the removeEmptyAndApplyTypeOrmOperator helper method
  //     // action
  //     const result = await service.dateHasMaches({ fromDate: '2023-01-01', toDate: '2023-01-01' });

  //     // assert
  //     expect(result[0]).toBe(dateHasMachesDBMock[0].startDate);
  //     expect(result.length).toBe(dateHasMachesDBMock.length);
  //   });
  // });
  describe('create', () => {
    describe('happy case', () => {
      it('happy case', async () => {
        // prepare mock data
        const createFixtureDto: CreateFixtureInputDto = {
          tournamentUuid: FixtureDbMock.tournament.uuid,
          homeTeamUuid: FixtureDbMock.homeTeam.uuid,
          awayTeamUuid: FixtureDbMock.awayTeam.uuid,
          startDate: FixtureDbMock.startDate as any,
          endDate: FixtureDbMock.endDate as any,
          status: FixtureDbMock.status as any,
          homeScore: FixtureDbMock.homeScore,
          awayScore: FixtureDbMock.awayScore,
        };
        // create a spy for the repository find method
        teamServiceMock.findOne.mockResolvedValue(FixtureDbMock.homeTeam);
        tournamentServiceMock.findOne.mockResolvedValue(FixtureDbMock.awayTeam);
        fixtureRepoMock.create.mockResolvedValue(FixtureDbMock);
        fixtureRepoMock.save.mockResolvedValue(FixtureDbMock);
        // action
        const result = await service.create(createFixtureDto);

        // assert
        expect(teamServiceMock.findOne).toBeCalled();
        expect(tournamentServiceMock.findOne).toBeCalled();
        expect(result.homeTeam.uuid).toBe(FixtureDbMock.homeTeam.uuid);
        expect(result.awayTeam.uuid).toBe(FixtureDbMock.awayTeam.uuid);
      });
    });
    describe('bad case', () => {
      it('should throw error when provide homeTeam is awayTeam', async () => {
        // prepare mock data
        const createFixtureDto: CreateFixtureInputDto = {
          tournamentUuid: FixtureDbMock.tournament.uuid,
          homeTeamUuid: FixtureDbMock.homeTeam.uuid,
          awayTeamUuid: FixtureDbMock.homeTeam.uuid,
          startDate: FixtureDbMock.startDate as any,
          endDate: FixtureDbMock.endDate as any,
          status: FixtureDbMock.status as any,
          homeScore: FixtureDbMock.homeScore,
          awayScore: FixtureDbMock.awayScore,
        };
        // action
        try {
          const result = await service.create(createFixtureDto);
          expect(result).toThrowError();
        } catch (err) {
          // Assert
          expect(err).toBeInstanceOf(Error);
        }
      });
    });
  });
  describe('update', () => {
    describe('happy case', () => {
      it('happy case', async () => {
        // prepare mock data
        const updateFixtureInputDto: UpdateFixtureInputDto = {
          tournamentUuid: FixtureDbMock.tournament.uuid,
          homeTeamUuid: FixtureDbMock.homeTeam.uuid,
          awayTeamUuid: FixtureDbMock.awayTeam.uuid,
          startDate: FixtureDbMock.startDate as any,
          endDate: FixtureDbMock.endDate as any,
          status: FixtureDbMock.status as any,
          homeScore: 5,
          awayScore: FixtureDbMock.awayScore,
        };
        // create a spy for the repository find method
        fixtureRepoMock.findOne.mockResolvedValue(FixtureDbMock.homeTeam);
        teamServiceMock.findOne.mockResolvedValue(FixtureDbMock.homeTeam);
        tournamentServiceMock.findOne.mockResolvedValue(FixtureDbMock.awayTeam);
        fixtureRepoMock.create.mockResolvedValue(FixtureDbMock);
        fixtureRepoMock.save.mockResolvedValue(FixtureDbMock);
        // action
        const result = await service.update(FixtureDbMock.uuid, updateFixtureInputDto);

        // assert
        expect(teamServiceMock.findOne).toBeCalled();
        expect(tournamentServiceMock.findOne).toBeCalled();
        expect(result.homeScore).toBe(updateFixtureInputDto.homeScore);
      });
    });
    describe('bad case', () => {
      it('should throw error when provide homeTeam is awayTeam', async () => {
        // prepare mock data
        const fixtureInvalidUuid = 'invalid';
        // action
        try {
          const result = await service.update(fixtureInvalidUuid, {});
          expect(result).toThrowError();
        } catch (err) {
          // Assert
          expect(err).toBeInstanceOf(Error);
        }
      });
    });
  });
});
