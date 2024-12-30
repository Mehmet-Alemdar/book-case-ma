import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AdminManager {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  admin: User;

  @ManyToOne(() => User)
  manager: User;
}
