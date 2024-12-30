import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { AdminManager } from './user/entities/admin-manager.entity';
import { BookStore } from './book-store/book-store.entity';
import { BookStoreModule } from './book-store/book-store.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, AdminManager, BookStore],
      synchronize: true,
    }),
    UserModule,
    BookStoreModule,
  ],
})
export class AppModule {}
