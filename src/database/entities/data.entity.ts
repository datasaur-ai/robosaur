import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class DataEntity {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  filename: string;

  @Column()
  parsed_image_dir: string;

  @Column()
  team_id: number;

  @Column()
  hcp_ori_document_dir: string;

  @Column()
  file_type: string;

  @Column()
  file_page_size: number;

  @Column()
  original_filename: string;
}
