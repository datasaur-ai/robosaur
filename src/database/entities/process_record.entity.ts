import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DataPayload } from './data.entity';

@Entity()
export class ProcessRecordEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column((type) => DataPayload)
  data: DataPayload;
}
