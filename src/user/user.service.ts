import { Injectable, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from './role.enum';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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
    user['role'] = Role.USER;
    user['password'] = hashedPassword;
    user['createdBy'] = currentUser.id;

    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      throw new HttpException('Email is already taken', 400);
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
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
}
