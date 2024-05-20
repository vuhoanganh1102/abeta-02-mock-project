import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity()
export class Admin {
    @PrimaryGeneratedColumn({ name: 'id', type: 'bigint', unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    refreshToken: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    resetToken: string;

    @Column({ type: 'tinyint', default: 0 })
    isVerified: number;

    @CreateDateColumn()
    createdAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
