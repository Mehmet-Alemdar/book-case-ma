import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
  ): Promise<{ message: string }> {
    try {
      const bookStore = createBookStoreDto;

      const existingBookStore = await this.bookStoreRepository.findOne({
        where: { name: bookStore.name },
      });
      if (existingBookStore) {
        throw new HttpException(
          'Book store already exists',
          HttpStatus.BAD_REQUEST,
        );
      }

      const newBookStore = await this.bookStoreRepository.create(bookStore);
      const sadevBookStore = await this.bookStoreRepository.save(newBookStore);

      const bookStoreManager = new BookStoreManager();
      bookStoreManager['bookStore'] = sadevBookStore;
      bookStoreManager['user'] = currentUser;

      await this.bookStoreManagerRepository.save(bookStoreManager);

      return { message: 'Book store created successfully' };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'An unexpected error occurred',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAllBookStores(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: BookStore[];
    total: number;
    currentPage: number;
    limit: number;
  }> {
    const [data, total] = await this.bookStoreRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    return { data, total, currentPage: page, limit };
  }
}
