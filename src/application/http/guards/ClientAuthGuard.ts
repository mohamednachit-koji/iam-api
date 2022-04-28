import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClientAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const clientId = this.configService.get('CLIENT_ID');
    const clientSecret = this.configService.get('CLIENT_SECRET');

    const req = context.switchToHttp().getRequest();
    const { client_id, client_secret } = req.body;

    if (
      !client_id ||
      !client_secret ||
      client_id !== clientId ||
      client_secret !== clientSecret
    ) {
      throw new BadRequestException('Invalid client');
    }
    return true;
  }
}
