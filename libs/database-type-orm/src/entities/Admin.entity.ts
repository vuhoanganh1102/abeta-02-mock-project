import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    OneToMany, JoinColumn
} from 'typeorm';
import {Notification} from "./Notification.entity";

@Entity('admin')
export class Admin {
    @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
    id: number;

    @Column({ name: 'email', type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ name: 'password', type: 'varchar', length: 255 })
    password: string;

    @Column({ name: 'refresh_token', type: 'varchar', length: 255, nullable: true })
    refreshToken: string;

    @Column({ name: 'reset_token', type: 'varchar', length: 255, nullable: true })
    resetToken: string;

    @OneToMany(() => Notification, (notification) => notification.admin)
    @JoinColumn({name: 'notification_id'})
    notifications: Notification[]

    @Column({ name: 'notification_id', type: 'bigint', unsigned: true })
    notificationId: number;

    @DeleteDateColumn({ name: 'deleted_at', type: 'datetime' })
    deletedAt: string;

    @CreateDateColumn({ name: 'created_at', type: 'datetime' })
    createdAt: string;

    @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
    updatedAt: string;
}
