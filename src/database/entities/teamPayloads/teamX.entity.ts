import { Entity } from 'typeorm';
import { BasePayload } from '../base-payload.entity';

// save keeping
@Entity({ name: process.env.TEAM_ID })
export class TeamX extends BasePayload {}
