import { Entity, JoinColumn, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';

import { BaseEntity } from '../../common/entities/base.entity';
import { ROLES } from '../../common/constants';
import { IUser } from '../interfaces/user.interface';

import { OrderEntity } from '../../order/entities/order.entity';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({
    nullable: false,
    default: 100
  })
  points: number;

  @Column({ type: 'enum', enum: ROLES })
  role: ROLES;

  @OneToMany(() => OrderEntity, order => order.user)
  orders: OrderEntity[];
}
