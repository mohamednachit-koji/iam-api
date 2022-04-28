import { DomainException } from './../exceptions/DomainException';
import { EmailService } from './../ports/EmailService';
import { TokenRepository } from 'domain/ports/TokenRepository';
import { UserRepository } from './../ports/UserRepository';

export class ResetUserPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: TokenRepository,
    private readonly emailService: EmailService,
  ) {}

  async execute(userId: string, clientId: string): Promise<void> {
    const user = await this.userRepository.findOne(userId);
    if (!user || !user.enabled) {
      throw new DomainException('User not found');
    }

    const accessToken = await this.tokenRepository.createAccessToken(
      userId,
      clientId,
    );

    await this.userRepository.update(user.id, {
      resetPasswordToken: accessToken.id,
    });

    await this.emailService.sendResetPasswordEmail(accessToken.token, user);
  }
}
