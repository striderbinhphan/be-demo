import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Team } from '../../entities';
import { GetTeamsInputDto } from './dto/team.dto';
import { IMPORTED_TEAMS, TeamDBMock } from './mocks/team.mock';
import { TeamService } from './team.service';
import * as helpers from '../../shared/helpers';
import { BadRequestException } from '@nestjs/common';

jest.mock('../../../public/teams.json', () => IMPORTED_TEAMS);

describe('TeamService', () => {
  let service: TeamService;
  const mockTeamService = {};
  const mockTeamRepo = {
    findOne: jest.fn(),
    count: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: mockTeamRepo,
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
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
      const listTeamMock = [TeamDBMock];
      const filtersMock: GetTeamsInputDto = {
        page: 1,
        perpage: 20,
        skip: undefined,
      };
      // create a spy for the removeEmptyAndApplyTypeOrmOperator helper method
      const spyApplyTypeormOperator = jest.spyOn(helpers, 'removeEmptyAndApplyTypeOrmOperator');
      spyApplyTypeormOperator.mockReturnValue({});
      // create a spy for the repository find method
      mockTeamRepo.find.mockResolvedValue(listTeamMock as Team[]);
      // create a spy for the repository count method
      mockTeamRepo.count.mockResolvedValue(1);

      // action
      const result = await service.findAll(filtersMock);

      // assert
      expect(spyApplyTypeormOperator).toBeCalled();
      expect(mockTeamRepo.find).toBeCalled();
      expect(mockTeamRepo.count).toBeCalled();
      expect(result.totalElements).toBe(listTeamMock.length);
      expect(result.data[0].uuid).toBe(TeamDBMock.uuid);
    });
  });

  describe('findOne', () => {
    describe('happy case', () => {
      it('happy case', async () => {
        // prepare mock data
        const teamUuidMock = TeamDBMock.uuid;
        // create a spy for the repository spyFindOne method
        mockTeamRepo.findOne.mockResolvedValue(TeamDBMock as Team);

        // action
        const result = await service.findOne(teamUuidMock);

        // assert
        expect(mockTeamRepo.findOne).toBeCalled();
        expect(result.uuid).toBe(TeamDBMock.uuid);
      });
    });
    describe('bad case', () => {
      it('Bad case', async () => {
        // prepare mock data
        const teamUuidMock = 'invalidId';
        // create a spy for the repository spyFindOne method
        mockTeamRepo.findOne.mockResolvedValue(undefined as Team);
        // action
        try {
          const result = await service.findOne(teamUuidMock);
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
        mockTeamRepo.count.mockResolvedValue(1);

        // action
        const result = await service.onModuleInit();

        // assert
        expect(mockTeamRepo.count).toBeCalled();
      });
      it('should initilize', async () => {
        // prepare mock data

        // create a spy for the repository spyFindOne method
        mockTeamRepo.count.mockResolvedValue(0);
        mockTeamRepo.create.mockResolvedValue(TeamDBMock);
        mockTeamRepo.save.mockResolvedValue(TeamDBMock);

        // action
        const result = await service.onModuleInit();

        // assert
        expect(mockTeamRepo.count).toBeCalled();
      });
    });
  });
});
