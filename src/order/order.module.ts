import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './entities/order.entity';
import { UserService } from 'src/user/services/user.service';
import { UserEntity } from 'src/user/entities/user.entity';
import { BookService } from 'src/book/book.service';
import { BookEntity } from 'src/book/entities/book.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    TypeOrmModule.forFeature([UserEntity]),
    TypeOrmModule.forFeature([BookEntity])
  ],
  providers: [OrderService, UserService, BookService],
  controllers: [OrderController],
  exports: [OrderService, TypeOrmModule],
})
export class OrderModule {}
