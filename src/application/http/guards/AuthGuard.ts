import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserModel } from 'infrastructure/database/models/UserModel';
import { EntityManager } from 'typeorm';
import jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    protected readonly entityManager: EntityManager,
    protected readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const token = req.headers.authorization.split(' ')[1];
      const data = jwt.verify(
        token,
        this.configService.get('ACCESS_TOKEN_SECRET'),
      );
      const userId = data.sub as string;
      const user = await this.entityManager.findOne(
        UserModel,
        { id: userId },
        { relations: ['address', 'roles'] },
      );
      if (!user || !user.enabled) throw new UnauthorizedException();
      req.user = user;
      req.accessToken = token;
      req.accessTokenId = (data as any).token_id;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
