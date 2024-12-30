import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class AdminManager {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  adminId: User;

  @ManyToOne(() => User)
  managerId: User;
}
