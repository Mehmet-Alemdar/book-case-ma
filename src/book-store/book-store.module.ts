import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookStoreController } from './book-store.controller';
import { BookStoreService } from './book-store.service';
import { BookStore } from './book-store.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BookStore, User])],
  controllers: [BookStoreController],
  providers: [BookStoreService],
})
export class BookStoreModule {}
