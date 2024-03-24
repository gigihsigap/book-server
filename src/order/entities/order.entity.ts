// order.entity.ts
import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { BookEntity } from '../../book/entities/book.entity';
import { BaseEntity } from 'src/common/entities/base.entity';

@Entity()
export class OrderEntity extends BaseEntity {
  @Column()
  status: string;

  @Column()
  user_id: string;

  @Column()
  book_id: string;

  @ManyToOne(() => UserEntity, user => user.orders)
  user: UserEntity;

  @ManyToMany(() => BookEntity)
  @JoinTable()
  book: BookEntity;
}