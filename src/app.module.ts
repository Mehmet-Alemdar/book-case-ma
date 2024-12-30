import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AdminManager } from './user/entities/admin-manager.entity';
import { BookStore } from './book-store/entities/book-store.entity';
import { BookStoreModule } from './book-store/book-store.module';
import { BookStoreManager } from './book-store/entities/book-store-manager.entity';
import { BookModule } from './book/book.module';
import { Book } from './book/book.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, AdminManager, BookStore, BookStoreManager, Book],
      synchronize: true,
    }),
    UserModule,
    BookStoreModule,
    BookModule,
  ],
})
export class AppModule {}
