import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './book.entity';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { BookStore } from '../book-store/entities/book-store.entity';
import { BookStoreManager } from 'src/book-store/entities/book-store-manager.entity';
import { User } from '../user/entities/user.entity';
import { AdminManager } from '../user/entities/admin-manager.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Book,
      BookStore,
      User,
      AdminManager,
      BookStoreManager,
    ]),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
