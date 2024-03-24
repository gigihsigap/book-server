import { Injectable, Logger } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { UserEntity } from '../../user/entities/user.entity';
import { UserService } from '../../user/services/user.service';
import { IPayload } from '../interfaces/payload.interface';
import { userToken } from '../../common/utils/user.token';
import { IUserToken } from '../interfaces/userToken.interface';
import { CreateUserDto } from '../../user/dto/user.dto';
import { errorHandler } from '../../common/utils/errorHandler';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) { }

  public async login(email: string, password: string): Promise<any> {
    try {
      const user = await this.userService.findOneBy({ key: 'email', value: email });
      if (!user || !(await bcrypt.compare(password, user.password))) throw new NotFoundException('Usuario o contraseña incorrectos');
      return this.generateJWT(user);
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  public async checkToken(token: string) {
    try {
      const managerToken: IUserToken | string = userToken(token);
      if (typeof managerToken === 'string') return false;
      if (managerToken.isExpired) return false;
      const user = await this.userService.findOneAuth(managerToken.sub);
      return user;
    } catch (error) {
      errorHandler(error, this.logger);
    }
  }

  public async register(createUserDto: CreateUserDto): Promise<UserEntity> {
    return await this.userService.createUser(createUserDto);
  }

  public singJWT({ payload, secret, expiresIn }: { payload: jwt.JwtPayload; secret: string; expiresIn: number | string; }) {
    return jwt.sign(payload, secret, { expiresIn });
  }

  public async generateJWT(user: UserEntity): Promise<any> {
    const getUser: UserEntity = await this.userService.findOne(user.id);
    const payload: IPayload = {
      sub: getUser.id,
      role: getUser.role,
    };
    const accessToken = this.singJWT({
      payload,
      secret: this.configService.get('JWT_AUTH'),
      expiresIn: '1d',
    });
    return {
      accessToken,
      User: getUser,
    };
  }

  public async recoverPassword(email: string): Promise<any> {
    const user = await this.userService.findOneBy({ key: 'email', value: email });
    const payload: IPayload = {
      sub: user.id,
      role: user.role,
    };
    const accessToken = this.singJWT({
      payload,
      secret: this.configService.get('JWT_AUTH'),
      expiresIn: '1h',
    });
    return {
      accessToken,
    };
  }
}
