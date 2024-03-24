import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BookModule } from './book/book.module';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { BookEntity } from './book/entities/book.entity';
import { BookController } from './book/book.controller';
import { BookService } from './book/book.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    
    ConfigModule.forRoot({
      isGlobal: true,
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    TypeOrmModule.forFeature([BookEntity]),
    BookModule,
    OrderModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController, BookController],
  providers: [AppService, BookService],
})
export class AppModule {}

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       load: [ormConfig],
//       expandVariables: true,
//     }),
//     TypeOrmModule.forRootAsync({
//       useFactory:
//         process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
//     }),
//     // UserModule,
//     // AuthModule,
//     // OrderModule,
//     BookModule
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
