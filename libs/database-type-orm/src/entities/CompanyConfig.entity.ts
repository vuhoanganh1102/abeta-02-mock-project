import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('company_config')
export class CompanyConfig {
    @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'morning_start_time', type: 'timestamp' })
    morningStartTime: string;

    @Column({ name: 'morning_end_time', type: 'timestamp' })
    morningEndTime: string;

    @Column({ name: 'afternoon_start_time', type: 'timestamp' })
    afternoonStartTime: string;

    @Column({ name: 'afternoon_end_time', type: 'timestamp' })
    afternoonEndTime: string;
}
