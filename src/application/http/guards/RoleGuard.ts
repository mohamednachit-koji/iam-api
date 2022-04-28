import { EntityManager } from 'typeorm';
import { AuthGuard } from './AuthGuard';
import {
  applyDecorators,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';

@Injectable()
class RoleGuard extends AuthGuard {
  constructor(
    private readonly reflector: Reflector,
    protected readonly entityManager: EntityManager,
    protected readonly configService: ConfigService,
  ) {
    super(entityManager, configService);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const role = this.reflector.get<string[]>('role', context.getHandler());
    await super.canActivate(context);
    const req = context.switchToHttp().getRequest();
    const userRoles = req.user.roles.map((userRole) => userRole.name);
    if (!userRoles.includes(role)) {
      throw new UnauthorizedException(`role ${role} not met by user`);
    }
    return true;
  }
}

export const Role = (role: string) => {
  if (!role) {
    throw new Error('Malformed role guard');
  }
  return applyDecorators(SetMetadata('role', role), UseGuards(RoleGuard));
};
