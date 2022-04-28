import { DomainException } from './../exceptions/DomainException';
import { EncryptionService } from '../ports/EncryptionService';
import { UserRepository } from 'domain/ports/UserRepository';
import { TokenRepository } from '../ports/TokenRepository';

export class UpdateResetPassword {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(newPassword: string, token: string): Promise<void> {
    const [tokenId, userId] = this.tokenRepository.verifyAccessToken(token);
    const user = await this.userRepository.findOne(userId);
    if (user.resetPasswordToken !== tokenId) {
      throw new DomainException('Invalid token');
    }

    const hashedPassword = await this.encryptionService.hash(newPassword);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
    });
  }
}
