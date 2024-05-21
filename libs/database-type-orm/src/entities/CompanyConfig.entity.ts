import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('company_config')
export class CompanyConfig {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'morning_start_time', type: 'timestamp', default: null })
  morningStartTime: string;

  @Column({ name: 'morning_end_time', type: 'timestamp', default: null })
  morningEndTime: string;

  @Column({ name: 'afternoon_start_time', type: 'timestamp', default: null })
  afternoonStartTime: string;

  @Column({ name: 'afternoon_end_time', type: 'timestamp', default: null })
  afternoonEndTime: string;
}
