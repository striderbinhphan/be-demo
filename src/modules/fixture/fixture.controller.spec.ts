import { Test, TestingModule } from '@nestjs/testing';
import { CreateFixtureInputDto, UpdateFixtureInputDto } from './dto/fixture.dto';
import { FixtureEventService } from './fixture-event.service';
import { FixtureController } from './fixture.controller';
import { FixtureService } from './fixture.service';
import { DateHasMachesDBMock, FixtureDbMock, ListFixtureResponseMock } from './mocks/fixture.mock';
import { map } from 'rxjs';
describe('FixtureController', () => {
  let controller: FixtureController;
  const fixtureServiceMock = {
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    dateHasMaches: jest.fn(),
  };
  const fixtureEventServiceMock = {
    subscribeUpdatedFixtureEvent: jest.fn(),
  };
  const req: any = {
    get: jest.fn(),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FixtureController],
      providers: [
        {
          provide: FixtureService,
          useValue: fixtureServiceMock,
        },
        {
          provide: FixtureEventService,
          useValue: fixtureEventServiceMock,
        },
      ],
    }).compile();

    controller = module.get<FixtureController>(FixtureController);
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
      const filters = {
        ...paginationInputMock,
        seasonUuid: undefined,
        calendarDay: undefined,
      };
      fixtureServiceMock.findAll.mockResolvedValue(ListFixtureResponseMock);

      // action
      const result = await controller.findAll(filters);

      // assert
      expect(result.totalElements).toBe(1);
      expect(result.data[0].tournament.uuid).toBe(FixtureDbMock.tournament.uuid);
      expect(result.data[0].homeTeam.uuid).toBe(FixtureDbMock.homeTeam.uuid);
      expect(result.data[0].awayTeam.uuid).toBe(FixtureDbMock.awayTeam.uuid);
    });
  });
  describe('create', () => {
    it('happy case', async () => {
      // prepare
      const createFixtureDto: CreateFixtureInputDto = {
        homeTeamUuid: FixtureDbMock.homeTeam.uuid,
        awayTeamUuid: FixtureDbMock.awayTeam.uuid,
        tournamentUuid: FixtureDbMock.tournament.uuid,
        startDate: new Date(FixtureDbMock.startDate),
        endDate: new Date(FixtureDbMock.endDate),
        homeScore: FixtureDbMock.homeScore,
        awayScore: FixtureDbMock.awayScore,
        status: FixtureDbMock.status as any,
      };
      fixtureServiceMock.create.mockResolvedValue(FixtureDbMock);

      // action
      const result = await controller.create(createFixtureDto);

      // assert
      expect(result.uuid).toBe(FixtureDbMock.uuid);
      expect(result.tournament.uuid).toBe(FixtureDbMock.tournament.uuid);
      expect(result.homeTeam.uuid).toBe(FixtureDbMock.homeTeam.uuid);
      expect(result.awayTeam.uuid).toBe(FixtureDbMock.awayTeam.uuid);
    });
  });
  describe('update', () => {
    it('happy case', async () => {
      // prepare
      const updateFixtureInputDtoMock: Partial<UpdateFixtureInputDto> = {
        homeScore: 1,
      };
      fixtureServiceMock.update.mockResolvedValue({
        ...FixtureDbMock,
        homeScore: 1,
      });

      // action
      const result = await controller.update(FixtureDbMock.uuid, updateFixtureInputDtoMock);

      // assert
      expect(result.uuid).toBe(FixtureDbMock.uuid);
      expect(result.homeScore).toBe(updateFixtureInputDtoMock.homeScore);
    });
  });
  describe('events', () => {
    it('happy case', async () => {
      // prepare
      fixtureEventServiceMock.subscribeUpdatedFixtureEvent.mockResolvedValue({
        ...FixtureDbMock,
        homeScore: 1,
      });

      // action
      const result = controller.events(req);

      // assert
      expect(result).not.toBe(undefined);
    });
  });
  describe('findAll', () => {
    it('happy case', async () => {
      // prepare
      const filters = {
        fromDate: '2023-01-01',
        toDate: '2023-01-01',
      };
      fixtureServiceMock.dateHasMaches.mockResolvedValue(DateHasMachesDBMock);

      // action
      const result = await controller.dateHasMaches(filters);

      // assert
      expect(result[0]).toBe(DateHasMachesDBMock[0]);
    });
  });
});
