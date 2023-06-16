import { UserMiddleware } from './user.middleware';

describe('user.middleware', () => {
  const userMiddleware = new UserMiddleware();
  const req: any = {
    get: jest.fn().mockReturnValue('access-token'),
  };
  const next = jest.fn();

  afterAll(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  describe('UserMiddleware', () => {
    it('call next function', async () => {
      await userMiddleware.use(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});
