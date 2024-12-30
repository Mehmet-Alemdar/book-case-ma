import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { User } from 'src/user/entities/user.entity';
import { BookStore } from 'src/book-store/entities/book-store.entity';
import { BookStoreManager } from 'src/book-store/entities/book-store-manager.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookQuantityDto } from './dto/update-quantity-book.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(BookStore)
    private bookStoreRepository: Repository<BookStore>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(BookStoreManager)
    private bookStoreManagerRepository: Repository<BookStoreManager>,
  ) {}

  async createBook(createBookDto: CreateBookDto, currentUser: User) {
    const bookStore = await this.bookStoreRepository.findOne({
      where: { id: createBookDto.bookStoreId },
    });
    if (!bookStore) {
      throw new HttpException('Book store not found', 404);
    }

    const book = createBookDto;
    book['admin'] = currentUser.id;
    book['bookStore'] = bookStore;

    const existingBook = await this.bookRepository.findOne({
      where: { name: book.name, bookStore: bookStore },
    });
    if (existingBook) {
      throw new HttpException('Book already exists', 400);
    }

    const newBook = await this.bookRepository.create(book);
    return this.bookRepository.save(newBook);
  }

  async updateBook(
    updateBookQuantityDto: UpdateBookQuantityDto,
    currentUser: User,
  ) {
    const bookStore = await this.bookStoreRepository.findOne({
      where: { id: updateBookQuantityDto.bookStoreId },
    });
    if (!bookStore) {
      throw new HttpException('Book store not found', 404);
    }
    const book = await this.bookRepository.findOne({
      where: { id: updateBookQuantityDto.bookId },
    });
    if (!book) {
      throw new HttpException('Book not found', 404);
    }

    const bookStoreManager = await this.bookStoreManagerRepository.findOne({
      where: { user: { id: currentUser.id }, bookStore: { id: bookStore.id } },
    });

    if (!bookStoreManager) {
      throw new HttpException('you are not responsible for this store', 401);
    }

    book.quantity = updateBookQuantityDto.quantity;
    return this.bookRepository.save(book);
  }
}
