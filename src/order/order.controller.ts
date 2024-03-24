import { Controller, UseGuards, Get, Post, Put, Body, Query, Patch, Param, ParseUUIDPipe, Delete, Req, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags, ApiParam } from '@nestjs/swagger/dist';

import { AuthGuard, RolesGuard } from '../auth/guards';
import { OrderService } from './order.service';
import { ResponseMessage } from 'src/common/interfaces/messageRes.interface';
import { ORDER_ENUM } from 'src/common/constants';
import { QueryDto } from 'src/common/dto/query.dto';

import { Request } from 'express';
import { CreateOrderDto } from './dto/order.dto';
// import { BookService } from 'src/book/book.service';

@ApiTags('Order')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    // private readonly bookService: BookService,
  ) { }

  // @Post()
  // async create(@Body() createBookDto: CreateBookDto): Promise<ResponseMessage> {
  //   return {
  //     statusCode: 200,
  //     data: await this.bookService.create(createBookDto)
  //   }
  // }

  @Post()
  @UseGuards(AuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req: Request): Promise<ResponseMessage> {

    const { user_id } = req;
    const { book_id } = createOrderDto;
    return {
      statusCode: 200,
      data: await this.orderService.createOrder(user_id, book_id)
    }
  }

  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'offset', type: 'number', required: false })
  @ApiQuery({ name: 'order', enum: ORDER_ENUM, required: false })
  @ApiQuery({ name: 'attr', type: 'string', required: false })
  @ApiQuery({ name: 'value', type: 'string', required: false })
  @UseGuards(AuthGuard)
  @Get()
  async findUserOrders(
    @Query() queryDto: QueryDto,
    @Req() req: Request): Promise<ResponseMessage> {

    const { user_id } = req;
    return {
      statusCode: 200,
      data: await this.orderService.findUserOrders(queryDto, user_id)
    }
  }

  @ApiParam({ name: 'order_id', type: 'string' })
  @UseGuards(AuthGuard)
  @Patch('confirm/:order_id')
  async confirmOrder(
    @Param('order_id', ParseUUIDPipe) order_id: string,
    @Req() req: Request): Promise<ResponseMessage> {
    
    const { user_id } = req;
    return {
      statusCode: 200,
      data: await this.orderService.confirmOrder(order_id, user_id)
    }
  }

  @ApiParam({ name: 'order_id', type: 'string' })
  @Delete('cancel/:order_id')
  async cancelOrder(
    @Param('order_id', ParseUUIDPipe) order_id: string,
    @Req() req: Request): Promise<ResponseMessage> {
      
    const { user_id } = req;
    return {
      statusCode: 200,
      data: await this.orderService.cancelOrder(order_id, user_id)
    }
  }
}
