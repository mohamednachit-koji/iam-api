import { User } from '../entities/User';

export interface EmailService {
  sendResetPasswordEmail(token: string, user: User): Promise<void>;
}
