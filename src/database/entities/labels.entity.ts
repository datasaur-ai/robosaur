import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { TeamsEntity } from './teams.entity';

@Entity({ name: 'labels' })
export class LabelsEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column()
  code: string;

  @Column((type) => TeamsEntity)
  team: TeamsEntity;

  @Column({ default: false })
  is_from_emoji: boolean;
}
