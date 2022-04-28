import { User } from '../entities/User';
import { Token } from 'domain/entities/Token';
import { UserRefreshToken } from 'domain/entities/UserRefreshToken';
import { JwtPayload } from 'jsonwebtoken';

export interface TokenRepository {
  createIdToken(user: User, clientId: string): Promise<string>;
  createAccessToken(userId: string, clientId: string): Promise<Token>;
  createRefreshToken(userId: string, accessTokenId: string): Promise<Token>;

  deleteRefreshTokenByAccessToken(token: string, userId: string): Promise<void>;
  deleteRefreshToken(token: string): Promise<void>;

  findRefreshToken(token: string): Promise<UserRefreshToken>;

  verifyAccessToken(token: string): [string, string];
}
