import { LoggerMiddleware } from './logger.middleware';

describe('loggerMiddleware', () => {
  let loggerMiddleware: LoggerMiddleware;
  const next = jest.fn();
  const req: any = {
    get: jest.fn(),
  };
  beforeEach(() => {
    loggerMiddleware = new LoggerMiddleware();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  it('call next function', async () => {
    await loggerMiddleware.use(req, null, next);
    expect(next).toHaveBeenCalled();
  });
});
