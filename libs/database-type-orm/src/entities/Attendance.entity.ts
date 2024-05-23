import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn, OneToMany,
} from 'typeorm';
import { User } from './User.entity';
import { Request } from './Request.entity';
import { AttendanceStatus } from '../../../core/src/constants/enum';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => User, (user) => user.attendances)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'date', type: 'date' })
  date: string;

  @Column({ name: 'check_in', type: 'timestamp', nullable: true })
  checkIn: Date;

  @Column({ name: 'check_out', type: 'timestamp', nullable: true })
  checkOut: Date;

  @Column({ name: 'work_hours', type: 'float', nullable: true })
  workHours: number;

  @Column({ name: 'late_time',type: 'float', nullable: true })
  lateTime: number;

  @Column({
    name: 'status',
    type: 'int',
    unsigned: true,
    default: AttendanceStatus.ACTIVE,
    comment: '1: active, 0: deleted, 2: pending, 3: reject',
  })
  status: number;

  @OneToMany(() => Request, (requests) => requests.attendance)
  requests: Request[];

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
