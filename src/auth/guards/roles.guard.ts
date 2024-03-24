import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';

import { ADMIN_KEY, ROLES, ROLES_KEY } from '../../common/constants';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const roles = this.reflector.get<Array<keyof typeof ROLES>>(ROLES_KEY, context.getHandler(),);
      const admin = this.reflector.get<Array<string>>(ADMIN_KEY, context.getHandler(),);
      const request = context.switchToHttp().getRequest<Request>();
      const { user_role } = request;
      if (roles === undefined) {
        if (!admin) return true;
        if (admin && user_role === ROLES.ADMIN) return true;
        throw new UnauthorizedException('You do not have permissions to access this route.',);
      }
      if (user_role === ROLES.ADMIN) return true;
      const isAuthorized = roles.some((role) => user_role === role);
      if (!isAuthorized)
        throw new UnauthorizedException('You do not have permissions to access this route.',);
      return true;
    } catch (error) {
      throw new InternalServerErrorException('Error validating permission.');
    }
  }
}
