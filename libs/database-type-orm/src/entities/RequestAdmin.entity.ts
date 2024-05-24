import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Request } from './Request.entity';
import { Admin } from './Admin.entity';
<<<<<<< HEAD
=======
import { RequestStatus } from '../../../core/src/constants/enum';
>>>>>>> 5e97883e6ca1a69ba7eb2a9198dbd5e968e16e7d

@Entity('request_admin')
export class RequestAdmin {
  @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
  id: number;

<<<<<<< HEAD
  @OneToOne(() => Request)
  @JoinColumn({ name: 'request_id' })
  request: Request;

  @Column({ name: 'request_id', type: 'bigint', unsigned: true })
  requestId: number;

  @ManyToOne(() => Admin, (admin) => admin.requests)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({ name: 'admin_id', type: 'bigint', unsigned: true })
  adminId: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
=======
  @Column({
    name: 'status',
    type: 'tinyint',
    unsigned: true,
    default: RequestStatus.UNRESOLVED,
  })
  status: number;

  @OneToOne(() => Request)
  @JoinColumn({ name: 'request_id' })
  request: Request;

  @Column({ name: 'request_id', type: 'bigint', unsigned: true })
  requestId: number;

  @ManyToOne(() => Admin, (admin) => admin.requests)
  @JoinColumn({ name: 'admin_id' })
  admin: Admin;

  @Column({ name: 'admin_id', type: 'bigint', unsigned: true })
  adminId: number;

  @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
  deletedAt: string;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: string;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: string;
}
>>>>>>> 5e97883e6ca1a69ba7eb2a9198dbd5e968e16e7d
