import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DataPayload } from './data';

@Entity({ name: 'process_record' })
export class ProcessRecordEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @Column({ type: 'json' })
  data?: DataPayload;
}
