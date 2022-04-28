import { DomainException } from './../exceptions/DomainException';
import { UserAccess } from 'domain/entities/UserAccess';
import { TokenRepository } from '../ports/TokenRepository';
import { EncryptionService } from '../ports/EncryptionService';
import { UserRepository } from './../ports/UserRepository';

export class AuthenticateUser {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
    private readonly tokenRepository: TokenRepository,
  ) {}

  async execute(
    username: string,
    password: string,
    clientId: string,
  ): Promise<UserAccess> {
    const user = await this.userRepository.findOneByUsername(username);

    if (
      !user ||
      !user.enabled ||
      !(await this.encryptionService.compare(password, user.password))
    ) {
      throw new DomainException('Invalid credentials');
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
