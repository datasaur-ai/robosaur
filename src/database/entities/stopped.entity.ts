import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'stopped' })
export class StoppedRecord {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column()
  team_id: number;

  @Column()
  save_keeping_id: number;

  @Column()
  file_name: string;
}
