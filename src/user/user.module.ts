import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AdminManager } from './entities/admin-manager.entity';
import { BookStore } from '../book-store/entities/book-store.entity';
import { BookStoreManager } from '../book-store/entities/book-store-manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, AdminManager, BookStore, BookStoreManager]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
