import { Repository } from 'typeorm';
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, UpdateUserDto } from '../dto/user.dto';
import { UserEntity } from '../entities/user.entity';
import { errorHandler } from '../../common/utils/errorHandler';
import { QueryDto } from '../../common/dto/query.dto';
import { ResponseMessage } from '../../common/interfaces/messageRes.interface';

@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  public async findAll(queryDto: QueryDto): Promise<UserEntity[]> {
    try {
      const { limit, offset, order, attr, value } = queryDto;
      const query = this.userRepository.createQueryBuilder('user');
      if (limit) query.take(limit);
      if (offset) query.skip(offset);
      if (order) query.orderBy('user.createdAt', order.toLocaleUpperCase() as any);
      if (attr && value) query.where(`user.${attr} ILIKE :value`, { value: `%${value}%` });
      return await query.getMany();
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  public async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    try {
      createUserDto.password = await this.encryptPassword(createUserDto.password);
      await this.userRepository.save(createUserDto);
      return await this.findOneBy({ key: 'email', value: createUserDto.email });
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  public async findOne(id: string): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new NotFoundException('User not found.');
      return user;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  public async update(id: string, updateUserDto: UpdateUserDto, authenticatedUserId: string): Promise<UserEntity> {
    try {
      // Retrieve the user data from the database
      const user: UserEntity = await this.findOne(id);
      
      // Check if the authenticated user is the same as the user being updated
      if (user.id !== authenticatedUserId) {
        throw new ForbiddenException('You are not allowed to update this user.');
      }
  
      // Encrypt the password if it's provided in the update
      if (updateUserDto.password) {
        updateUserDto.password = await this.encryptPassword(updateUserDto.password);
      }
  
      // Update the user data
      const userUpdated = await this.userRepository.update(id, updateUserDto);
  
      // Check if the user was successfully updated
      if (userUpdated.affected === 0) {
        throw new NotFoundException('User not updated.');
      }
  
      // Return the updated user data
      return await this.findOne(id);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  public async delete(id: string): Promise<ResponseMessage> {
    try {
      const user = await this.findOne(id);
      const deletedUser = await this.userRepository.delete(user.id);
      if (deletedUser.affected === 0) throw new BadRequestException('User not deleted.');
      return { statusCode: 200, message: 'User deleted.' };
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  public async findOneBy({ key, value }: { key: keyof CreateUserDto; value: any; }) {
    try {
      const user: UserEntity = await this.userRepository.findOne({ where: { [key]: value } });
      if (!user) throw new NotFoundException('User not deleted.');
      return user;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  public async findOneAuth(id: string): Promise<UserEntity> {
    try {
      const user: UserEntity = await this.userRepository.findOne({ where: { id } });
      if (!user) throw new UnauthorizedException('User associated with token not found.',);
      return user;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  private async encryptPassword(password: string): Promise<string> {
    return bcrypt.hashSync(password, +process.env.HASH_SALT);
  }
}
