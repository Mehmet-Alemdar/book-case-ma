import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { BookStore } from './book-store.entity';

@Entity()
export class BookStoreManager {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => BookStore)
  bookStore: BookStore;
}
