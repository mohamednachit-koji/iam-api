import { User } from '../entities/User';

export interface UserRepository {
  findOne(id: string): Promise<User | undefined>;

  findOneByUsername(username: string): Promise<User | undefined>;

  update(id: string, data: Partial<User>): Promise<void>;
}
