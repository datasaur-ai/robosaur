import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'stopped_text_extraction_job' })
export class StoppedRecord {
  @ObjectIdColumn()
  _id: number;

  @Column()
  team: number;

  @Column()
  page: string;
}
