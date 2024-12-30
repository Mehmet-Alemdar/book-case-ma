import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { BookStoreService } from './book-store.service';
import { CreateBookStoreDto } from './dto/create-book-store.dto';
import { User } from '../user/entities/user.entity';
import { User as UserDecorator } from '../auth/user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../user/role.enum';

@Controller('book-store')
export class BookStoreController {
  constructor(private readonly bookStoreService: BookStoreService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async createBookStore(
    @Body() createBookStoreDto: CreateBookStoreDto,
    @UserDecorator() currentUser: User,
  ) {
    return this.bookStoreService.createBookStore(
      createBookStoreDto,
      currentUser,
    );
  }
}
