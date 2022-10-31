import { Entity } from 'typeorm';
import { BasePayload } from '../base-payload.entity';
import { TEAM_SURATINSTRUKSI } from '../teams.entity';

@Entity({ name: TEAM_SURATINSTRUKSI })
export class Team15 extends BasePayload {}
