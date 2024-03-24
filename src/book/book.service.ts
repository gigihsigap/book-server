import { Repository, Transaction, EntityManager } from 'typeorm';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { BookEntity } from './entities/book.entity';
import { errorHandler } from '../common/utils/errorHandler';
import { QueryDto } from '../common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/deleteRes.interface';

@Injectable()
export class BookService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(BookEntity)
    private readonly bookRepository: Repository<BookEntity>,
  ) { }

  async findAll(queryDto: QueryDto): Promise<BookEntity[]> {
    const { limit, offset, order, attr, value } = queryDto;
    const query = this.bookRepository.createQueryBuilder('book');

    if (limit) query.take(limit);
    if (offset) query.skip(offset);
    if (order) query.orderBy('book.created_at', order.toLocaleUpperCase() as 'ASC' | 'DESC');
    if (attr && value) query.where(`book.${attr} ILIKE :value`, { value: `%${value}%` });

    try {
      return await query.getMany();
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async create(createBookDto: CreateBookDto): Promise<BookEntity> {
    const { title, author, cover, price, tags } = createBookDto;

    const book = new BookEntity();
    book.title = title;
    book.author = author;
    book.cover = cover;
    book.price = price;
    book.tags = tags;

    book.generateSlug();

    try {
      await this.bookRepository.save(book);
      return book;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async bulkCreate(booksData: CreateBookDto[]): Promise<BookEntity[]> {
    const books: BookEntity[] = [];

    try {
      for (const bookData of booksData) {
        const book = new BookEntity();
        book.title = bookData.title;
        book.author = bookData.author;
        book.cover = bookData.cover;
        book.price = bookData.price;
        book.tags = bookData.tags;
        book.generateSlug();
        const savedBook = await this.bookRepository.save(book);
        books.push(savedBook);
      }

      return books;
    } catch (error) {
      errorHandler(error, this.logger);
      return null;
    }
  }

  async findOne(id: string): Promise<BookEntity> {
    try {
      const book = await this.bookRepository.findOneBy({ id });
      if (!book) throw new NotFoundException();
      return book;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async update(id: string, input: UpdateBookDto): Promise<BookEntity> {
    try {
      const book: BookEntity = await this.findOne(id);
      const bookUpdated = await this.bookRepository.update(book.id, input);
      if (bookUpdated.affected === 0) throw new NotFoundException();
      return book;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async remove(id: string): Promise<DeleteMessage> {
    try {
      const book = await this.findOne(id);
      await this.bookRepository.remove(book);
      return { deleted: true, message: 'Successful' };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  // Unused method, but it works
  // async findOneBy({ key, value }: { key: keyof CreateBookDto; value: any; }) {
  //   try {
  //     const book: BookEntity = await this.bookRepository.findOne({ where: { [key]: value } });
  //     if (!book) throw new NotFoundException();
  //     return book;
  //   } catch (error) {
  //     errorHandler(error, this.logger);
  //   }
  // }
}
