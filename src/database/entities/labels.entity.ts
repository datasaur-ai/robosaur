import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { TeamsEntity } from './teams.entity';

@Entity({ name: 'labels' })
export class LabelsEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column((type) => TeamsEntity)
  team: TeamsEntity;

  @Column({ default: false })
  is_from_emoji: boolean;
}
