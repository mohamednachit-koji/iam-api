import { Request } from 'express';
import {
  Body,
  Controller,
  Post,
  BadRequestException,
  UseGuards,
  Logger,
  InternalServerErrorException,
  Req,
} from '@nestjs/common';

import { UpdateResetPassword } from 'domain/features/UpdateResetPassword';
import { ResetUserPassword } from 'domain/features/ResetUserPassword';
import { UpdateUserPassword } from 'domain/features/UpdateUserPassword';

import { ClientAuthGuard } from '../guards/ClientAuthGuard';
import { ClientRequestForUserDto } from '../dtos/ClientRequestForUserDto';
import {
  UpdatePasswordDto,
  UpdateResetPasswordDto,
} from '../dtos/UpdateResetPasswordDto';
import { AuthGuard } from '../guards/AuthGuard';

@Controller('account')
export class AccountController {
  constructor(
    private readonly logger: Logger,
    private readonly resetUserPassword: ResetUserPassword,
    private readonly updateResetPassword: UpdateResetPassword,
    private readonly updateUserPassword: UpdateUserPassword,
  ) {}

  @UseGuards(ClientAuthGuard)
  @Post('/reset-password')
  public async resetPassword(
    @Body() data: ClientRequestForUserDto,
  ): Promise<void> {
    const { client_id, user_id } = data;
    try {
      await this.resetUserPassword.execute(user_id, client_id);
    } catch (e: any) {
      if (e.type !== 'DOMAIN') {
        this.logger.error(e.message);
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(ClientAuthGuard)
  @Post('/update-reset-password')
  public async updateResetPasswordReq(
    @Body() data: UpdateResetPasswordDto,
  ): Promise<void> {
    try {
      const { password, token } = data;
      await this.updateResetPassword.execute(password, token);
    } catch (e: any) {
      if (e.type !== 'DOMAIN') {
        this.logger.error(e.message);
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/update-password')
  public async updatePassword(
    @Req() req: Request,
    @Body() data: UpdatePasswordDto,
  ): Promise<void> {
    if (!data.password) {
      throw new BadRequestException('New password not provided');
    }
    await this.updateUserPassword.execute(req.user.id, data.password);
  }
}
