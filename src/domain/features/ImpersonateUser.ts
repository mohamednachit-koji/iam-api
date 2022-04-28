import { DomainException } from './../exceptions/DomainException';
import { UserAccess } from 'domain/entities/UserAccess';
import { TokenRepository } from '../ports/TokenRepository';
import { UserRepository } from './../ports/UserRepository';

export class ImpersonateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(userId: string, clientId: string): Promise<UserAccess> {
    const user = await this.userRepository.findOne(userId);

    if (!user) {
      throw new DomainException('user not found');
    }

    const idToken = await this.tokenRepository.createIdToken(user, clientId);

    const accessToken = await this.tokenRepository.createAccessToken(
      user.id,
      clientId,
    );
    const refreshToken = await this.tokenRepository.createRefreshToken(
      user.id,
      accessToken.token,
    );

    return {
      idToken,
      accessToken: accessToken.token,
      refreshToken: refreshToken.token,
      expiresIn: refreshToken.expiresIn,
    };
  }
}
