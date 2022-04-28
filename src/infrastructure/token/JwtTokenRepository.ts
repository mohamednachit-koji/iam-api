import { ConfigService } from '@nestjs/config';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User } from 'domain/entities/User';
import { TokenRepository } from 'domain/ports/TokenRepository';

import { UserRefreshTokenModelRepository } from '../database/repositories/UserRefreshTokenModelRepository';
import { Token } from 'domain/entities/Token';
import { UserRefreshToken } from 'domain/entities/UserRefreshToken';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenRepository implements TokenRepository {
  constructor(
    private readonly userRefreshTokenRepository: UserRefreshTokenModelRepository,
    private readonly configService: ConfigService,
  ) {}

  async createIdToken(user: User, clientId: string): Promise<string> {
    const idTokenData = {
      email: user.email,
      email_verified: user.emailVerified,
      family_name: user.familyName,
      given_name: user.givenName,
      birth_date: user.birthDate,
      phone: user.phone,
      nickname: `${user.givenName}${user.familyName}`,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      user_id: user.id,
      user_roles: user.roles.map((role) => role.name),
      address: user.address,
      clientID: clientId,
      iss: this.configService.get('BASE_URL'),
      sub: user.id,
      aud: clientId,
      iat: Date.now(),
      exp: Date.now(),
    };
    return jwt.sign(idTokenData, crypto.randomBytes(16).toString('hex'));
  }

  async createAccessToken(userId: string, clientId: string): Promise<Token> {
    const accessTokenId = crypto.randomBytes(32).toString('hex');
    const expiresIn = parseInt(this.configService.get('ACCESS_TOKEN_EXPIRY'));
    const accessToken = jwt.sign(
      {
        iss: this.configService.get('BASE_URL'),
        sub: userId,
        userId: userId,
        aud: clientId,
        token_id: accessTokenId,
      },
      this.configService.get('ACCESS_TOKEN_SECRET'),
      {
        expiresIn,
      },
    );
    return { id: accessTokenId, token: accessToken, expiresIn };
  }

  async createRefreshToken(
    userId: string,
    accessTokenId: string,
  ): Promise<Token> {
    const refreshTokenId = crypto.randomBytes(64).toString('hex');
    const expiresIn = this.configService.get('REFRESH_TOKEN_EXPIRY');

    await this.userRefreshTokenRepository.create({
      expiry: new Date(Date.now() + expiresIn * 1000),
      accessToken: accessTokenId,
      token: refreshTokenId,
      user: new User(userId),
    });
    return { id: refreshTokenId, expiresIn, token: refreshTokenId };
  }

  async deleteRefreshTokenByAccessToken(
    token: string,
    userId: string,
  ): Promise<void> {
    await this.userRefreshTokenRepository.removeByAccessToken(token, userId);
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await this.userRefreshTokenRepository.remove(token);
  }

  async findRefreshToken(token: string): Promise<UserRefreshToken> {
    return this.userRefreshTokenRepository.findOne(token);
  }

  verifyAccessToken(token: string): [string, string] {
    const decoded = jwt.verify(
      token,
      this.configService.get('ACCESS_TOKEN_SECRET'),
    );
    return [(decoded as any).token_id, decoded.sub as string];
  }
}
