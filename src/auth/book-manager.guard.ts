import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookStoreManager } from '../book-store/entities/book-store-manager.entity';
import { User } from '../user/entities/user.entity';

@Injectable()
export class BookStoreManagerGuard implements CanActivate {
  constructor(
    @InjectRepository(BookStoreManager)
    private bookStoreManagerRepository: Repository<BookStoreManager>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { bookStoreId } = request.body;
    const currentUser: User = request.user;

    const bookStoreManager = await this.bookStoreManagerRepository.findOne({
      where: { user: { id: currentUser.id }, bookStore: { id: bookStoreId } },
    });

    if (!bookStoreManager) {
      throw new HttpException('You are not responsible for this store', 401);
    }

    return true;
  }
}
