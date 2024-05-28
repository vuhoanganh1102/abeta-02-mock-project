import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsCurrent } from '../../../core/src/constants/enum';

@Entity('email_otp')
export class EmailOtp {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

  // @ManyToOne(() => User, (user) => user.otp)
  // @JoinColumn({ name: 'user_id' })
  // user: User;

  @Column({ name: 'user_id', type: 'bigint', unsigned: true })
  userId: number;

  @Column({ name: 'user_email', type: 'varchar' })
  email: string;

  @Column({ name: 'otp', type: 'varchar', length: 500 })
  otp: string;

  @Column({
    name: 'otp_category',
    type: 'tinyint',
    comment: '0: verify otp, 1: reset password otp',
  })
  otpCategory: number;

  @Column({ name: 'user_type', type: 'tinyint', comment: '0: user, 1: admin' })
  userType: number;

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
