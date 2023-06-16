import { Test, TestingModule } from '@nestjs/testing';
import { ListTournamentResponseMock, TournamentDbMock } from './mocks/tournament.mock';
import { TournamentController } from './tournament.controller';
import { TournamentService } from './tournament.service';

describe('TournamentController', () => {
  let controller: TournamentController;
  const tournamentServiceMock = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TournamentController],
      providers: [
        {
          provide: TournamentService,
          useValue: tournamentServiceMock,
        },
      ],
    }).compile();

    controller = module.get<TournamentController>(TournamentController);
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
      tournamentServiceMock.findAll.mockResolvedValue(ListTournamentResponseMock);

      // action
      const result = await controller.findAll(paginationInputMock);

      // assert
      expect(result.totalElements).toBe(1);
      expect(result.data[0].uuid).toBe(TournamentDbMock.uuid);
    });
  });
  describe('findOne', () => {
    it('happy case', async () => {
      // prepare
      const tournamentUuid = TournamentDbMock.uuid;
      tournamentServiceMock.findOne.mockResolvedValue(TournamentDbMock);

      // action
      const result = await controller.findOne(tournamentUuid);

      // assert
      expect(result.uuid).toBe(tournamentUuid);
    });
  });
});
