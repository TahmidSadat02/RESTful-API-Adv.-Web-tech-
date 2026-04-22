import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('menu_items') 
export class Menu {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column('text')
  description!: string;

  @Column('decimal', { precision: 5, scale: 2 })
  price!: number;

  @Column({ default: true })
  isAvailable!: boolean;
}