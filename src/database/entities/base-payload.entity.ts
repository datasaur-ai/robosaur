import { Column, ObjectID, ObjectIdColumn, PrimaryColumn } from 'typeorm';

export class ReadingResult {
  [id_page_index: string]: Array<any>;
}

export class DocumentData {
  [id_page_index: string]: {
    [label_name: string]: {
      id: string;
      text: string;
      confidence_mapping: number;
      confidence_reading: number;
      box: Array<{
        x: number;
        y: number;
      }>;
      ori_text: string;
    };
  };
}
export abstract class BasePayload {
  @ObjectIdColumn()
  _id: ObjectID;

  @PrimaryColumn()
  id: number;

  @Column()
  filename: string;

  @Column({ type: 'json' })
  reading_result: ReadingResult;

  @Column({ type: 'json' })
  document_data_initial: DocumentData;

  @Column({ type: 'json' })
  document_data: DocumentData;

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

  @Column({ type: 'array' })
  continuous_index: Array<number>;

  @Column({ nullable: true })
  ocr_status?: string;

  @Column({ nullable: true })
  page_count?: string;
}
