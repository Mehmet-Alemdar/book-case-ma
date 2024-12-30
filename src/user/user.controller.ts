import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { User } from './user.entity';
import { User as UserDecorator } from '../auth/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('admin')
  @UsePipes(new ValidationPipe())
  async createAdmin(@Body() createAdminDto: CreateAdminDto): Promise<User> {
    return this.userService.createAdmin(createAdminDto);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN)
  @UsePipes(new ValidationPipe())
  async createUser(
    @Body() createUserDto: CreateUserDto,
    @UserDecorator() currentUser: User,
  ): Promise<User> {
    return this.userService.createUser(createUserDto, currentUser);
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.userService.login(loginDto);
  }
}
