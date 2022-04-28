import { EntityManager, FindConditions } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from 'domain/entities/User';
import { UserRepository } from 'domain/ports/UserRepository';
import { UserModelMapper } from '../mappers/UserModelMapper';
import { UserModel } from '../models/UserModel';

@Injectable()
export class UserModelRepository implements UserRepository {
  constructor(
    private entityManager: EntityManager,
    private userMapper: UserModelMapper,
  ) {}

  async findOne(id: string): Promise<User | undefined> {
    const result = await this.entityManager.findOne(
      UserModel,
      {
        id,
      },
      { relations: ['address', 'roles'] },
    );
    return this.userMapper.modelToEntity(result);
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    const userModel = await this.entityManager.findOne(
      UserModel,
      { username },
      { relations: ['address', 'roles'] },
    );
    return this.userMapper.modelToEntity(userModel);
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    await this.entityManager.update(UserModel, { id }, data);
  }

  async find(
    filter: Partial<User> = {},
    skip: number = 0,
    take: number = 30,
  ): Promise<[User[], number]> {
    const where: FindConditions<UserModel> = filter;
    return this.entityManager.findAndCount(UserModel, {
      where,
      skip,
      take,
    });
  }
}
