import { UserRepository } from '../ports/UserRepository';
import { DomainException } from './../exceptions/DomainException';
import { UserAccess } from '../entities/UserAccess';
import { TokenRepository } from '../ports/TokenRepository';

export class RefreshAccessToken {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(refreshToken: string, clientId: string): Promise<UserAccess> {
    const userRefreshToken = await this.tokenRepository.findRefreshToken(
      refreshToken,
    );

    if (!userRefreshToken) {
      throw new DomainException('Refresh token not found');
    }

    const user = await this.userRepository.findOne(userRefreshToken.user.id);

    if (!userRefreshToken.user.enabled) {
      throw new DomainException('User is disabled');
    }

    await this.tokenRepository.deleteRefreshTokenByAccessToken(
      userRefreshToken.accessToken,
      user.id,
    );

    const idToken = await this.tokenRepository.createIdToken(user, clientId);

    const accessToken = await this.tokenRepository.createAccessToken(
      user.id,
      clientId,
    );
    const newRefreshToken = await this.tokenRepository.createRefreshToken(
      user.id,
      accessToken.token,
    );

    return {
      idToken,
      accessToken: accessToken.token,
      refreshToken: newRefreshToken.token,
      expiresIn: newRefreshToken.expiresIn,
    };
  }
}
