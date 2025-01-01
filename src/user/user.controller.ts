import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AssignManagerToStoreDto } from './dto/assign-manager-to-store.dto';
import { User } from './entities/user.entity';
import { User as UserDecorator } from '../auth/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { BookStoreManagerGuard } from '../auth/book-manager.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('admin')
  @UsePipes(new ValidationPipe())
  async createAdmin(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createAdmin(createUserDto);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UserDecorator() currentUser: User,
  ): Promise<{ message: string }> {
    return this.userService.createUser(createUserDto, currentUser);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.userService.login(loginDto);
  }

  @Post('assign-manager-to-store')
  @UseGuards(JwtAuthGuard, RoleGuard, BookStoreManagerGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async assignManagerToStore(
    @Body() assignManagerToStoreDto: AssignManagerToStoreDto,
    @UserDecorator() currentUser: User,
  ): Promise<{ message: string }> {
    return this.userService.assignManagerToStore(
      assignManagerToStoreDto,
      currentUser,
    );
  }
}
