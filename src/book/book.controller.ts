import {
  Controller,
  Post,
  Put,
  Get,
  Query,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookQuantityDto } from './dto/update-quantity-book.dto';
import { FindBooksByStoreIdDto } from './dto/find-books-by-store-id.dto';
import { SearchBookDto } from './dto/search-book.dto';
import { Book } from './book.entity';
import { User } from '../user/entities/user.entity';
import { User as UserDecorator } from '../auth/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { BookStoreManagerGuard } from '../auth/book-manager.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard, BookStoreManagerGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UserDecorator() currentUser: User,
  ): Promise<{ message: string; data: Book }> {
    return this.bookService.createBook(createBookDto, currentUser);
  }

  @Put('update-quantity')
  @UseGuards(JwtAuthGuard, RoleGuard, BookStoreManagerGuard)
  @Roles(Role.ADMIN, Role.STORE_MANAGER)
  @UsePipes(new ValidationPipe())
  async updateBookQuantity(
    @Body() updateBookQuantityDto: UpdateBookQuantityDto,
  ): Promise<{ message: string }> {
    return this.bookService.updateBook(updateBookQuantityDto);
  }

  @Get('list')
  @UsePipes(new ValidationPipe({ transform: true }))
  async findBooksByStoreId(@Query() query: FindBooksByStoreIdDto) {
    const { bookStoreId, page, limit } = query;
    return this.bookService.findBooksByStoreId(bookStoreId, page, limit);
  }

  @Get('search')
  @UsePipes(new ValidationPipe({ transform: true }))
  async searchBook(@Query() query: SearchBookDto) {
    const { search, page, limit } = query;
    return this.bookService.searchBook(search, page, limit);
  }
}
