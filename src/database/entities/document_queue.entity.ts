import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { DataPayload } from './data';

@Entity({ name: 'document_queue' })
export class DocumentQueueEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  team: number;

  @Column((type) => DataPayload)
  data?: DataPayload;

  @Column()
  save_keeping_id: number;
}
