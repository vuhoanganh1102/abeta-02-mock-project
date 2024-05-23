import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { IsCurrent } from '../../../core/src/constants/enum';
import { User } from './User.entity';

@Entity('email_otp')
export class EmailOtp {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  @ManyToOne(() => User, (user) => user.otp)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'user_email', type: 'varchar' })
  email: string;

  @Column({ name: 'otp', type: 'varchar', length: 500 })
  otp: string;

  @Column({
    name: 'otp_category',
    type: 'tinyint',
    comment: '1: verify otp, 2: reset password otp',
  })
  otpCategory: number;

  @Column({
    name: 'is_current',
    type: 'tinyint',
    default: IsCurrent.IS_CURRENT,
  })
  isCurrent: number;

  @Column({ name: 'expired_at', type: 'datetime' })
  expiredAt: string;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
