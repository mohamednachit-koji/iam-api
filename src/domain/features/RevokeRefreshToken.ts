import { TokenRepository } from '../ports/TokenRepository';

export class RevokeRefreshToken {
  constructor(private readonly tokenRepository: TokenRepository) {}

  async execute(refreshToken: string): Promise<void> {
    await this.tokenRepository.deleteRefreshToken(refreshToken);
  }
}
