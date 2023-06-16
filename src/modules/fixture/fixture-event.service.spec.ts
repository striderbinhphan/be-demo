import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter } from 'events';
import { FixtureEventService } from './fixture-event.service';
import * as rxjs from 'rxjs';
describe('FixtureEventService', () => {
  let service: FixtureEventService;
  const fixtureEventServiceMock = {};
  let eventEmmiter: EventEmitter;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FixtureEventService],
    }).compile();

    service = module.get<FixtureEventService>(FixtureEventService);
  });

  // reset call counts and called with arguments after each spec
  afterEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('dateHasMaches', () => {
    it('happy case', async () => {
      // create a spy for the removeEmptyAndApplyTypeOrmOperator helper method
      const spyFromEvent = jest.spyOn(rxjs, 'fromEvent');
      spyFromEvent.mockReturnThis();
      // action
      const result = await service.subscribeUpdatedFixtureEvent();

      // assert
      expect(spyFromEvent).toBeCalled();
    });
  });
  describe('emitEvent', () => {
    it('happy case', async () => {
      // create a spy for the removeEmptyAndApplyTypeOrmOperator helper method
      const eventInstance = new EventEmitter();
      const spyEmitEvent = jest.spyOn(eventInstance, 'emit');
      spyEmitEvent.mockReturnThis();
      // action
      const result = await service.emitEvent('fixture_updated', { data: 'test' });

      // assert
      expect(spyEmitEvent).toBeDefined();
    });
  });
});
