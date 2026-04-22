import {Entity, Column, PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    CASHIER = 'cashier',
    CUSTOMER = 'customer',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    fullName!: string;

    @Column({ unique: true })
    email!: string;

    @Column()
    password!: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.CUSTOMER })
    role!: UserRole;

    @CreateDateColumn()
    createdAt!: Date;
}