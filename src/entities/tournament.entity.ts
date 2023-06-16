import { BaseEntity } from '../shared';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tournaments' })
export class Tournament extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;
}
