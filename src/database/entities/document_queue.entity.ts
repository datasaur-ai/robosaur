import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';
import { DataPayload } from './data';

@Entity({ name: 'document_queue' })
export class DocumentQueueEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @PrimaryColumn()
  id: number;

  @Column()
  team: number;

  @Column({ type: 'json' })
  data?: DataPayload;

  @Column()
  save_keeping_id: number;
}
