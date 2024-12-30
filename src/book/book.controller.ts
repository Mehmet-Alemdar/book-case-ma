import {
  Controller,
  Post,
  Put,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookQuantityDto } from './dto/update-quantity-book.dto';
import { User } from '../user/entities/user.entity';
import { User as UserDecorator } from '../auth/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async createBook(
    @Body() createBookDto: CreateBookDto,
    @UserDecorator() currentUser: User,
  ) {
    return this.bookService.createBook(createBookDto, currentUser);
  }

  @Put('update-quantity')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STORE_MANAGER)
  @UsePipes(new ValidationPipe())
  async updateBookQuantity(
    @Body() updateBookQuantityDto: UpdateBookQuantityDto,
    @UserDecorator() currentUser: User,
  ) {
    return this.bookService.updateBook(updateBookQuantityDto, currentUser);
  }
}
