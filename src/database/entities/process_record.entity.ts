import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DataEntity } from './data.entity';

@Entity()
export class ProcessRecordEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column((type) => DataEntity)
  data: DataEntity;
}
