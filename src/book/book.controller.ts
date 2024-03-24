import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';

import { BookService } from './book.service';

import { QueryDto } from '../common/dto/query.dto';
import { CreateBookDto, UpdateBookDto } from './dto/book.dto';
import { DeleteMessage } from '../common/interfaces/deleteRes.interface';
import { ORDER_ENUM } from '../common/constants';
import { ResponseMessage } from 'src/common/interfaces/messageRes.interface';

// import { AuthGuard, RolesGuard } from '../auth/guards';
// import { RolesAccess } from '../auth/decorators';

@ApiTags('Book')
@ApiBearerAuth()
// @UseGuards(AuthGuard, RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) { }

  @Post('bulk')
  async bulkCreate(@Body() createBookDtos: CreateBookDto[]): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.bookService.bulkCreate(createBookDtos)
    }
  }

  @Post()
  async create(@Body() createBookDto: CreateBookDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.bookService.create(createBookDto)
    }
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @Get()
  async findAll(@Query() queryDto: QueryDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.bookService.findAll(queryDto)
    }
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseMessage> {
    // return this.bookService.findOne(id);
    return {
      statusCode: 200,
      data: await this.bookService.findOne(id)
    }
  }

  @ApiParam({ name: 'id', type: 'string' })
  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateBookDto: UpdateBookDto): Promise<ResponseMessage> {
    return {
      statusCode: 200,
      data: await this.bookService.update(id, updateBookDto)
    }
  }

  // @RolesAccess('ADMIN')
  @ApiParam({ name: 'id', type: 'string' })
  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<DeleteMessage> {
    return await this.bookService.remove(id);
  }
}
