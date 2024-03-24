import { Repository } from 'typeorm';
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { OrderEntity } from './entities/order.entity';
import { errorHandler } from '../common/utils/errorHandler';
import { QueryDto } from '../common/dto/query.dto';
import { DeleteMessage } from 'src/common/interfaces/deleteRes.interface';

import { STATUS } from '../common/constants/status'
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/services/user.service';
import { UpdateOrderDto } from './dto/order.dto';
import { BookService } from 'src/book/book.service';

@Injectable()
export class OrderService {
  private readonly logger = new Logger('UserService');

  constructor(
    private readonly userService: UserService,
    private readonly bookService: BookService,

    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) { }

  async createOrder(user_id: string, book_id: string): Promise<OrderEntity> {

    const [user, book] = await Promise.all([
      this.userService.findOneAuth(user_id),
      this.bookService.findOne(book_id),
    ]);

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (!book) {
      throw new NotFoundException('Book not found.');
    }

    const order = new OrderEntity();
    order.status = STATUS.PENDING;
    order.user_id = user_id;
    order.book_id = book_id;

    try {
      await this.orderRepository.save(order);
      return order;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findOne(id: string): Promise<OrderEntity> {
    try {
      const order = await this.orderRepository.findOneBy({ id });
      if (!order) throw new NotFoundException();
      return order;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async findUserOrders(queryDto: QueryDto, user_id: string): Promise<OrderEntity[]> {
    const { limit, offset, order, attr, value } = queryDto;
    const query = this.orderRepository.createQueryBuilder('order');

    // Filter orders by user ID
    query.where('order.user_id = :user_id', { user_id });

    if (limit) query.take(limit);
    if (offset) query.skip(offset);
    if (order) query.orderBy('order.created_at', order.toLocaleUpperCase() as 'ASC' | 'DESC');
    if (attr && value) query.where(`order.${attr} ILIKE :value`, { value: `%${value}%` });

    try {
      return await query.getMany();
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async confirmOrder(order_id: string, user_id: string): Promise<OrderEntity> {
    try {
      const [user, order] = await Promise.all([
        this.userService.findOneAuth(user_id),
        this.findOne(order_id),
      ]);

      if (user.id !== order.user_id) {
        throw new ForbiddenException('Unauthorized.');
      }

      const book =  await this.bookService.findOne(order.book_id);

      if (!book) {
        throw new NotFoundException('Book no longer available.');
      }

      if (user.points < book.price) {
        throw new BadRequestException('Not enough points.')
      }

      const userUpdatedFund = user.points - book.price;
      const _ = await this.userService.calculatePoint(user_id, userUpdatedFund);

      order.status = STATUS.SUCCESS;
      const orderUpdated = await this.orderRepository.update(order.id, order);
      if (orderUpdated.affected === 0) throw new NotFoundException();
      
      return order;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  async cancelOrder(order_id: string, user_id: string): Promise<DeleteMessage> {
    try {
      const [user, order] = await Promise.all([
        this.userService.findOneAuth(user_id),
        this.findOne(order_id)
      ]);

      if (user.id !== order.user_id) {
        throw new ForbiddenException('Unauthorized.');
      }

      await this.orderRepository.remove(order);
      return { deleted: true, message: 'Successful' };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }
}
