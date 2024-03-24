import {
    Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import slugify from 'slugify';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity('book')
@Unique(['title'])
export class BookEntity extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  author: string

  @Column({
    nullable: false,
    default: "https://placehold.co/320x320"
  })
  cover: string;

  @Column({ nullable: false })
  price: number;

  @Column('text', { array: true, nullable: true, default: '{}' })
  tags: string[];

  @Column({ nullable: false })
  slug: string;

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    this.slug = slugify(this.title, { lower: true, remove: /[*+~.()'"!:@]/g });
  }
}
