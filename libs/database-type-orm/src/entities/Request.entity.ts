import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Attendance } from './Attendance.entity';
import { RequestStatus } from '../../../core/src/constants/enum';

@Entity('request')
export class Request {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @Column({ name: 'title', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'content', type: 'varchar', length: 1000 })
  content: string;

  @Column({ name: 'check_in', type: 'timestamp', nullable: true })
  checkIn: Date;

  @Column({ name: 'check_out', type: 'timestamp', nullable: true })
  checkOut: Date;

  @ManyToOne(() => Attendance, (attendance) => attendance.requests)
  @JoinColumn({ name: 'attendance_id' })
  attendance: Attendance;

  @Column({ name: 'attendance_id', type: 'bigint', unsigned: true })
  attendanceId: number;

  @Column({ name: 'image_url', type: 'varchar', nullable: true })
  imageUrl: string;

  @Column({
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: RequestStatus.UNRESOLVED,
  })
  status: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;
  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
