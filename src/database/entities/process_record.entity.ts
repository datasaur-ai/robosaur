import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DataPayload } from './data';

@Entity()
export class ProcessRecordEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column((type) => DataPayload)
  data: DataPayload;
}
