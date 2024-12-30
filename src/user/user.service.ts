import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { AdminManager } from './entities/admin-manager.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { AssignManagerToStoreDto } from './dto/assign-manager-to-store.dto';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { BookStoreManager } from 'src/book-store/entities/book-store-manager.entity';
import { BookStore } from 'src/book-store/entities/book-store.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(AdminManager)
    private adminManagerRepository: Repository<AdminManager>,
    @InjectRepository(BookStore)
    private bookStoreRepository: Repository<BookStore>,
    @InjectRepository(BookStoreManager)
    private bookStoreManagerRepository: Repository<BookStoreManager>,
  ) {}

  async createAdmin(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const admin = createUserDto;
    admin['role'] = Role.ADMIN;
    admin['password'] = hashedPassword;

    const existingUser = await this.userRepository.findOne({
      where: { email: admin.email },
    });
    if (existingUser) {
      throw new HttpException('Email is already taken', 400);
    }

    const user = this.userRepository.create(admin);
    return this.userRepository.save(user);
  }

  async createUser(
    createUserDto: CreateUserDto,
    currentUser: User,
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = createUserDto;
    user['role'] = Role.STORE_MANAGER;
    user['password'] = hashedPassword;

    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new HttpException('Email is already taken', 400);
    }

    const newUser = await this.userRepository.create(user);
    const savedUser = await this.userRepository.save(newUser);

    if (currentUser.role === Role.ADMIN) {
      const adminManager = new AdminManager();
      adminManager.admin = currentUser;
      adminManager.manager = savedUser;

      await this.adminManagerRepository.save(adminManager);
    }

    return savedUser;
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const user = await this.userRepository.findOne({
      where: { email: loginDto.email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', 401);
    }

    const token = await jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: '1h',
      },
    );

    return { token };
  }

  async assignManagerToStore(
    assignManagerToStoreDto: AssignManagerToStoreDto,
    currentUser: User,
  ) {
    const adminManager = await this.adminManagerRepository.findOne({
      where: {
        admin: { id: currentUser.id },
        manager: { id: assignManagerToStoreDto.userId },
      },
    });

    if (!adminManager) {
      throw new HttpException(
        'You are not allowed to assign manager to store',
        403,
      );
    }

    const bookStore = await this.bookStoreRepository.findOne({
      where: { id: assignManagerToStoreDto.storeId },
    });

    if (!bookStore) {
      throw new HttpException('Book store not found', 404);
    }

    const bookStoreManager = new BookStoreManager();
    bookStoreManager.bookStore = bookStore;
    bookStoreManager.user = await this.userRepository.findOne({
      where: { id: assignManagerToStoreDto.userId },
    });

    return this.bookStoreManagerRepository.save(bookStoreManager);
  }
}
