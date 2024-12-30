import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class BookStore {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;
}
