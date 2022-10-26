import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity({ name: '15' })
export class DataPayload {
  @ObjectIdColumn()
  id?: ObjectID;

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
