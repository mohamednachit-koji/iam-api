import { EncryptionService } from '../ports/EncryptionService';
import { UserRepository } from 'domain/ports/UserRepository';

export class UpdateUserPassword {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encryptionService: EncryptionService,
  ) {}

  async execute(userId: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne(userId);
    const hashedPassword = await this.encryptionService.hash(newPassword);
    await this.userRepository.update(user.id, {
      password: hashedPassword,
      resetPasswordToken: null,
    });
  }
}
