import { Test, TestingModule } from '@nestjs/testing';
import { ListTeamResponseMock, TeamDBMock } from './mocks/team.mock';
import { TeamController } from './team.controller';
import { TeamService } from './team.service';

describe('TeamController', () => {
  let controller: TeamController;
  const teamServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeamController],
      providers: [
        {
          provide: TeamService,
          useValue: teamServiceMock,
        },
      ],
    }).compile();

    controller = module.get<TeamController>(TeamController);
  });

  // reset call counts and called with arguments after each spec
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  describe('findAll', () => {
    it('happy case', async () => {
      // prepare
      const paginationInputMock = {
        page: 1,
        perpage: 20,
        skip: undefined,
      };
      teamServiceMock.findAll.mockResolvedValue(ListTeamResponseMock);

      // action
      const result = await controller.findAll(paginationInputMock);

      // assert
      expect(result.totalElements).toBe(1);
      expect(result.data[0].uuid).toBe(TeamDBMock.uuid);
    });
  });
  describe('findOne', () => {
    it('happy case', async () => {
      // prepare
      const teamUuidMock = TeamDBMock.uuid;
      teamServiceMock.findOne.mockResolvedValue(TeamDBMock);

      // action
      const result = await controller.findOne(teamUuidMock);

      // assert
      expect(result.uuid).toBe(teamUuidMock);
    });
  });
});
