import { Column, ObjectID, ObjectIdColumn } from 'typeorm';

export abstract class BasePayload {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  filename: string;

  @Column()
  reading_result: Object;

  @Column()
  document_data_initial: Object;

  @Column()
  document_data: Object;

  @Column({ nullable: true })
  hcp_ori_document_dir?: string;

  @Column({ nullable: true })
  original_filename?: string;

  @Column({ nullable: true })
  parsed_image_dir?: string;

  @Column({ nullable: true })
  start_ocr?: string;

  @Column({ nullable: true })
  end_ocr?: string;

  @Column({ nullable: true })
  received_request?: string;

  @Column({ nullable: true })
  document_extension?: string;

  @Column((type) => Array<number>)
  continuous_index: Array<number>;

  @Column({ nullable: true })
  ocr_status?: string;

  @Column({ nullable: true })
  page_count?: string;
}