import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DataEntity } from './data.entity';

@Entity()
export class DocumentQueueEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  team: number;

  @Column((type) => DataEntity)
  data: DataEntity;
}
