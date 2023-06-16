import { MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './common/config';
import { createTypeOrmOptions } from './common/helpers/helper';
import { TournamentModule } from './modules/tournament/tournament.module';
import { TeamModule } from './modules/team/team.module';
import { FixtureModule } from './modules/fixture/fixture.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UserMiddleware } from './middlewares/user.middleware';

@Module({
  imports: [
    ConfigModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', '/upload/photo'),
      serveRoot: `/upload/photo`,
    }),
    TypeOrmModule.forRoot(createTypeOrmOptions('typeorm')),
    TournamentModule,
    TeamModule,
    FixtureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    consumer.apply(UserMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
