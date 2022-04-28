import { Request } from 'express';
import {
  Body,
  Controller,
  Post,
  BadRequestException,
  Get,
  Req,
  UseGuards,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';

import { ImpersonateUser } from 'domain/features/ImpersonateUser';
import { AuthenticateUser } from 'domain/features/AuthenticateUser';
import { FetchUserInfo } from 'domain/features/FetchUserInfo';
import { LogoutUser } from 'domain/features/LogoutUser';
import { RefreshAccessToken } from 'domain/features/RefreshAccessToken';
import { RevokeRefreshToken } from 'domain/features/RevokeRefreshToken';

import { ClientAuthGuard } from '../guards/ClientAuthGuard';
import { AuthGuard } from './../guards/AuthGuard';
import { Role } from '../guards/RoleGuard';
import { ClientRequestForUserDto } from '../dtos/ClientRequestForUserDto';
import { PasswordGrantDto } from '../dtos/PasswordGrantDto';
import { RefreshTokenGrantDto } from '../dtos/RefreshTokenGrantDto';
import { TokenExchangeDto } from '../dtos/TokenExchangeDto';
import { UserInfoDto } from '../dtos/UserInfoDto';
import { RevokeTokenDto } from '../dtos/RevokeTokenDto';
import { UserAccessDto } from '../dtos/UserAccessDto';

@Controller('oidc')
export class OidcController {
  constructor(
    private readonly logger: Logger,
    private readonly authenticateUser: AuthenticateUser,
    private readonly refreshAccessToken: RefreshAccessToken,
    private readonly fetchUserInfo: FetchUserInfo,
    private readonly revokeRefreshToken: RevokeRefreshToken,
    private readonly impersonateUser: ImpersonateUser,
    private readonly logoutUser: LogoutUser,
  ) {}

  @Post('token')
  @UseGuards(ClientAuthGuard)
  public async exchangeToken(
    @Body() data: TokenExchangeDto,
  ): Promise<UserAccessDto> {
    try {
      if (data.grant_type === 'password') {
        const { username, password, client_id } = data as PasswordGrantDto;
        const userAccess = await this.authenticateUser.execute(
          username,
          password,
          client_id,
        );
        return UserAccessDto.fromEntity(userAccess);
      }

      if (data.grant_type === 'refresh_token') {
        const { client_id, refresh_token } = data as RefreshTokenGrantDto;
        const userAccess = await this.refreshAccessToken.execute(
          refresh_token,
          client_id,
        );
        return UserAccessDto.fromEntity(userAccess);
      }
    } catch (e: any) {
      if (e.type !== 'DOMAIN') {
        this.logger.error(e.message);
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }

    throw new BadRequestException('Invalid grant_type value');
  }

  @UseGuards(ClientAuthGuard)
  @Role('admin')
  @Post('/impersonate')
  public async impersonateUserRequest(
    @Body() data: ClientRequestForUserDto,
  ): Promise<UserAccessDto> {
    const { user_id, client_id } = data;
    try {
      const userAccess = await this.impersonateUser.execute(user_id, client_id);
      return UserAccessDto.fromEntity(userAccess);
    } catch (e: any) {
      if (e.type !== 'DOMAIN') {
        this.logger.error(e.message);
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(AuthGuard)
  @Get('/userinfo')
  public async fetchUserInfoRequest(@Req() req: Request): Promise<UserInfoDto> {
    try {
      const user = await this.fetchUserInfo.execute(req.user.id);
      return UserInfoDto.fromEntity(user);
    } catch (e: any) {
      if (e.type !== 'DOMAIN') {
        this.logger.error(e.message);
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(ClientAuthGuard)
  @Post('/token/revoke')
  public async revokeToken(@Body() data: RevokeTokenDto): Promise<void> {
    const { token } = data;
    try {
      await this.revokeRefreshToken.execute(token);
    } catch (e: any) {
      if (e.type !== 'DOMAIN') {
        this.logger.error(e.message);
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }

  @UseGuards(AuthGuard)
  @Post('/logout')
  public async logout(@Req() req: Request): Promise<void> {
    const { user, accessTokenId } = req;
    try {
      await this.logoutUser.execute(accessTokenId, user.id);
    } catch (e: any) {
      if (e.type !== 'DOMAIN') {
        this.logger.error(e.message);
        throw new InternalServerErrorException(e.message);
      }
      throw new BadRequestException(e.message);
    }
  }
}
