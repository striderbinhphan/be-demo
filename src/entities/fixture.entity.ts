import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity, EFixtureStatus } from '../shared';
import { Team } from './team.entity';
import { Tournament } from './tournament.entity';

@Entity({ name: 'fixtures' })
export class Fixture extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @ManyToOne(() => Team, (team) => team.uuid, { nullable: false })
  homeTeam: Team;

  @ManyToOne(() => Team, (team) => team.uuid, { nullable: false })
  awayTeam: Team;

  @ManyToOne(() => Tournament, (tournament) => tournament.uuid, { nullable: false })
  tournament: Tournament;

  @Column({ type: 'timestamp', nullable: false })
  startDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  homeScore: number;

  @Column({ type: 'tinyint', default: 0, nullable: true })
  awayScore: number;

  @Column({ type: 'tinyint' })
  status: EFixtureStatus;
}
