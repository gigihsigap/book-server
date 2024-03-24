import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookEntity } from './entities/book.entity';

// @Module({
//   controllers: [BookController],
//   providers: [BookService],
// })
// export class BookModule {}

Module({
  imports: [
    TypeOrmModule.forFeature([BookEntity])
  ],
  providers: [BookService],
  controllers: [BookController],
  exports: [BookService, TypeOrmModule],
})
export class BookModule {}

