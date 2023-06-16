import { Module } from '@nestjs/common';
import { FixtureService } from './fixture.service';
import { FixtureController } from './fixture.controller';
import { TeamModule } from '../team/team.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Fixture } from '../../entities';
import { TournamentModule } from '../tournament/tournament.module';
import { FixtureEventService } from './fixture-event.service';

@Module({
  imports: [TeamModule, TypeOrmModule.forFeature([Fixture]), TournamentModule],
  controllers: [FixtureController],
  providers: [FixtureService, FixtureEventService],
})
export class FixtureModule {}
