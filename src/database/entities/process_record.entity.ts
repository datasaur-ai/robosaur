import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DataPayload } from './data';

@Entity({ name: 'process_record' })
export class ProcessRecordEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column((type) => DataPayload)
  data?: DataPayload;
}
