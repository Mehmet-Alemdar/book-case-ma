import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { BookStore } from './book-store.entity';
import { CreateBookStoreDto } from './dto/create-book-store.dto';

@Injectable()
export class BookStoreService {
  constructor(
    @InjectRepository(BookStore)
    private bookStoreRepository: Repository<BookStore>,
  ) {}

  async createBookStore(
    createBookStoreDto: CreateBookStoreDto,
    currentUser: User,
  ) {
    const bookStore = createBookStoreDto;
    bookStore['admin'] = currentUser.id;

    const existingBookStore = await this.bookStoreRepository.findOne({
      where: { name: bookStore.name },
    });
    if (existingBookStore) {
      throw new HttpException('Book store already exists', 400);
    }

    const newBookStore = await this.bookStoreRepository.create(bookStore);
    return this.bookStoreRepository.save(newBookStore);
  }
}
