import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository, ILike } from 'typeorm';
import { Book } from './book.entity';
import { User } from 'src/user/entities/user.entity';
import { BookStore } from 'src/book-store/entities/book-store.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookQuantityDto } from './dto/update-quantity-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(BookStore)
    private bookStoreRepository: Repository<BookStore>,
  ) {}

  async createBook(
    createBookDto: CreateBookDto,
    currentUser: User,
  ): Promise<{ message: string; data: Book }> {
    try {
      const bookStore = await this.bookStoreRepository.findOne({
        where: { id: createBookDto.bookStoreId },
      });

      if (!bookStore) {
        throw new HttpException('Book store not found', HttpStatus.NOT_FOUND);
      }

      const book = createBookDto;
      book['admin'] = currentUser.id;
      book['bookStore'] = bookStore;

      const existingBook = await this.bookRepository.findOne({
        where: { name: book.name, bookStore: bookStore },
      });
      if (existingBook) {
        throw new HttpException('Book already exists', HttpStatus.BAD_REQUEST);
      }

      const newBook = await this.bookRepository.create(book);
      const savedBook = await this.bookRepository.save(newBook);

      return { message: 'Book created successfully', data: savedBook };
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

  async updateBook(updateBookQuantityDto: UpdateBookQuantityDto) {
    try {
      const bookStore = await this.bookStoreRepository.findOne({
        where: { id: updateBookQuantityDto.bookStoreId },
      });
      if (!bookStore) {
        throw new HttpException('Book store not found', HttpStatus.NOT_FOUND);
      }
      const book = await this.bookRepository.findOne({
        where: { id: updateBookQuantityDto.bookId, bookStore: bookStore },
      });
      if (!book) {
        throw new HttpException('Book not found', HttpStatus.NOT_FOUND);
      }

      book.quantity = updateBookQuantityDto.quantity;
      await this.bookRepository.save(book);
      return { message: 'Book quantity updated successfully' };
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

  async findBooksByStoreId(
    bookStoreId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Book[];
    total: number;
    currentPage: number;
    limit: number;
  }> {
    const [books, total] = await this.bookRepository.findAndCount({
      where: { bookStore: { id: bookStoreId }, quantity: MoreThan(0) },
      relations: ['bookStore'],
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: books,
      total: total,
      currentPage: page,
      limit: limit,
    };
  }

  async searchBook(
    name: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    data: Book[];
    total: number;
    currentPage: number;
    limit: number;
  }> {
    const [books, total] = await this.bookRepository.findAndCount({
      where: { name: ILike(`%${name}%`), quantity: MoreThan(0) },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      data: books,
      total: total,
      currentPage: page,
      limit: limit,
    };
  }
}
