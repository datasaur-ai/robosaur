import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DataPayload } from './data.entity';

@Entity()
export class DocumentQueueEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  team: number;

  @Column((type) => DataPayload)
  data: DataPayload;
}
