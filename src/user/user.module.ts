import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './entities/user.entity';
import { AuthService } from 'src/auth/services/auth.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity])
  ],
  providers: [UserService, AuthService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
