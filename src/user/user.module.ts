import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { AdminManager } from './entities/admin-manager.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, AdminManager])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
