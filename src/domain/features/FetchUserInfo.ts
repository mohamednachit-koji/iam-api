import { User } from './../entities/User';
import { UserRepository } from './../ports/UserRepository';

export class FetchUserInfo {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    return this.userRepository.findOne(userId);
  }
}
