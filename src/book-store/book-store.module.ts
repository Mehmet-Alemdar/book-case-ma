import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookStoreController } from './book-store.controller';
import { BookStoreService } from './book-store.service';
import { BookStore } from './entities/book-store.entity';
import { User } from '../user/entities/user.entity';
import { BookStoreManager } from './entities/book-store-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookStore, User, BookStoreManager])],
  controllers: [BookStoreController],
  providers: [BookStoreService],
})
export class BookStoreModule {}
