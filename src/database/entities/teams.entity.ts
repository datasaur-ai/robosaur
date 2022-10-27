import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: 'teams' })
export class TeamsEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  name: string;

  @Column({ nullable: true })
  url?: string;
}
