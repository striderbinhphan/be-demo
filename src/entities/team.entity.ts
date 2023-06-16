import { BaseEntity } from '../shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'teams' })
export class Team extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 200, nullable: true })
  bannelUrl: string;
}
