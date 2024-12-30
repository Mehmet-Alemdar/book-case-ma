import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { BookStore } from '../book-store/entities/book-store.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @ManyToOne(() => BookStore)
  bookStore: BookStore;
}
