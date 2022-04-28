import { TokenRepository } from 'domain/ports/TokenRepository';

export class LogoutUser {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(accessToken: string, userId: string): Promise<void> {
    await this.tokenRepository.deleteRefreshTokenByAccessToken(
      accessToken,
      userId,
    );
  }
}
