import { Column, Entity, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'teams' })
export class TeamsEntity {
  @ObjectIdColumn()
  _id: ObjectID;

  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  url?: string;
}
