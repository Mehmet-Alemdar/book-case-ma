import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { BookStore } from './entities/book-store.entity';
import { BookStoreManager } from './entities/book-store-manager.entity';
import { CreateBookStoreDto } from './dto/create-book-store.dto';

@Injectable()
export class BookStoreService {
  constructor(
    @InjectRepository(BookStore)
    private bookStoreRepository: Repository<BookStore>,
    @InjectRepository(BookStoreManager)
    private bookStoreManagerRepository: Repository<BookStoreManager>,
  ) {}

  async createBookStore(
    createBookStoreDto: CreateBookStoreDto,
    currentUser: User,
  ) {
    const bookStore = createBookStoreDto;

    const existingBookStore = await this.bookStoreRepository.findOne({
      where: { name: bookStore.name },
    });
    if (existingBookStore) {
      throw new HttpException('Book store already exists', 400);
    }

    const newBookStore = await this.bookStoreRepository.create(bookStore);
    const sadevBookStore = await this.bookStoreRepository.save(newBookStore);

    const bookStoreManager = new BookStoreManager();
    bookStoreManager['bookStore'] = sadevBookStore;
    bookStoreManager['user'] = currentUser;

    await this.bookStoreManagerRepository.save(bookStoreManager);

    return bookStoreManager;
  }
}
