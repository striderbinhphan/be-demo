import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../../entities';
import * as helpers from '../../shared/helpers';
import { BadRequestException } from '@nestjs/common';
import { TournamentService } from './tournament.service';
import { TournamentDbMock } from './mocks/tournament.mock';
import { GetTournamentsInputDto } from './dto/tournament.dto';

describe('TeamService', () => {
  let service: TournamentService;
  const mockTournamentRepo = {
    findOne: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TournamentService,
        {
          provide: getRepositoryToken(Tournament),
          useValue: mockTournamentRepo,
        },
      ],
    }).compile();

    service = module.get<TournamentService>(TournamentService);
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
      const tournamentList = [TournamentDbMock];
      const filtersMock: GetTournamentsInputDto = {
        page: 1,
        perpage: 20,
        skip: undefined,
      };
      // create a spy for the removeEmptyAndApplyTypeOrmOperator helper method
      const spyApplyTypeormOperator = jest.spyOn(helpers, 'removeEmptyAndApplyTypeOrmOperator');
      spyApplyTypeormOperator.mockReturnValue({});
      // mock resolved value for repository find method
      mockTournamentRepo.find.mockResolvedValue(tournamentList as Tournament[]);
      // mock resolved value for repository count method
      mockTournamentRepo.count.mockResolvedValue(1);
      // mock resolved value for Promise.all() method
      const spyPromiseAll = jest.spyOn(global.Promise, 'all');
      spyPromiseAll.mockResolvedValue([tournamentList, 1]);

      // action
      const result = await service.findAll(filtersMock);

      // assert
      expect(spyApplyTypeormOperator).toBeCalled();
      expect(mockTournamentRepo.find).toBeCalled();
      expect(mockTournamentRepo.count).toBeCalled();
      expect(spyPromiseAll).toBeCalled();
      expect(result.totalElements).toBe(tournamentList.length);
      expect(result.data[0].uuid).toBe(TournamentDbMock.uuid);
    });
  });
  describe('findOne', () => {
    describe('happy case', () => {
      it('happy case', async () => {
        // prepare mock data
        const tournamentUuid = TournamentDbMock.uuid;
        // create a spy for the repository spyFindOne method
        mockTournamentRepo.findOne.mockResolvedValue(TournamentDbMock as Tournament);

        // action
        const result = await service.findOne(tournamentUuid);

        // assert
        expect(mockTournamentRepo.findOne).toBeCalled();
        expect(result.uuid).toBe(TournamentDbMock.uuid);
      });
    });
    describe('bad case', () => {
      it('Bad case', async () => {
        // prepare mock data
        const tournamentUuid = 'invalidId';
        // create a spy for the repository spyFindOne method
        mockTournamentRepo.findOne.mockResolvedValue(undefined as Tournament);
        // action
        try {
          const result = await service.findOne(tournamentUuid);
          expect(result).toThrowError();
        } catch (err) {
          // Assert
          expect(err).toBeInstanceOf(BadRequestException);
        }
      });
    });
  });
  describe('OnModuleInit', () => {
    describe('happy case', () => {
      it('has been initialize', async () => {
        // create a spy for the repository spyFindOne method
        mockTournamentRepo.count.mockResolvedValue(1);

        // action
        const result = await service.onModuleInit();

        // assert
        expect(mockTournamentRepo.count).toBeCalled();
      });
      it('should initilize', async () => {
        // prepare mock data

        // create a spy for the repository spyFindOne method
        mockTournamentRepo.count.mockResolvedValue(0);
        mockTournamentRepo.create.mockResolvedValue(TournamentDbMock);
        mockTournamentRepo.save.mockResolvedValue(TournamentDbMock);

        // action
        const result = await service.onModuleInit();

        // assert
        expect(mockTournamentRepo.count).toBeCalled();
      });
    });
  });
});
