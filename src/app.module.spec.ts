import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';

jest.mock('@nestjs/typeorm', () => ({
  TypeOrmModule: {
    forRoot: jest.fn(),
  },
}));

jest.mock('./common/helpers/helper', () => ({
  createTypeOrmOptions: jest.fn(),
}));

jest.mock('./middlewares/logger.middleware', () => ({
  LoggerMiddleware: {},
}));

jest.mock('./modules/tournament/tournament.module', () => ({
  TournamentModule: {},
}));

jest.mock('./modules/team/team.module', () => ({
  TeamModule: {},
}));

jest.mock('./modules/fixture/fixture.module', () => ({
  FixtureModule: {},
}));

describe('AppModule', () => {
  it('should create an instance of AppModule', () => {
    const appModule = new AppModule();
    expect(appModule).toBeInstanceOf(AppModule);
  });

  it('should apply the LoggerMiddleware for all routes', () => {
    const consumer = {
      apply: jest.fn().mockReturnThis(),
      forRoutes: jest.fn(),
    };
    const appModule = new AppModule();
    appModule.configure(consumer);

    expect(consumer.apply).toHaveBeenCalledWith(LoggerMiddleware);
    expect(consumer.forRoutes).toHaveBeenCalledWith('*');
  });
});
