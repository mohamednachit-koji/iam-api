import { UserRepository } from 'domain/ports/UserRepository';
import { user1 } from './../../../fixtures/UserFixture';
import { RegisterUser } from 'domain/useCases/RegisterUser';
import { User } from 'domain/entities/User';

describe('RegisterUser', () => {
  it('should create user', async () => {
    // Mock
    const userRepository: UserRepository = {
      create: async (): Promise<User> => user1,
      findOne: async (): Promise<User | undefined> => null,
      findByUsername: async (): Promise<User[]> => [],
    };
    const spy = jest.spyOn(userRepository, 'create');
    // Run
    const registerUser = new RegisterUser(userRepository);
    const result = await registerUser.execute(
      user1.username,
      user1.password,
      user1.email,
      user1.firstName,
      user1.lastName,
    );
    // Assert
    expect(spy).toHaveBeenCalled();
    expect(result.id).toBe(user1.id);
    spy.mockRestore();
  });
});
