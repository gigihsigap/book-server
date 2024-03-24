import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BookEntity } from 'src/book/entities/book.entity';
import { UserEntity } from 'src/user/entities/user.entity';
// import { EmailQueue, FailedQueue, User } from 'src/user/entities/user.entity';

export default registerAs(
  'orm.config',
  (): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [BookEntity, UserEntity],
    synchronize: false, // Disable this always in production
    ssl: true
  }),
);
