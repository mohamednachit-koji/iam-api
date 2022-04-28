import { UserRefreshTokenModel } from '../models/UserRefreshTokenModel';
import { EntityManager, MoreThanOrEqual } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserRefreshToken } from 'domain/entities/UserRefreshToken';

@Injectable()
export class UserRefreshTokenModelRepository {
  constructor(private entityManager: EntityManager) {}

  async findOne(token: string): Promise<UserRefreshToken> {
    return this.entityManager.findOne(
      UserRefreshTokenModel,
      {
        token,
        expiry: MoreThanOrEqual(new Date()),
      },
      { relations: ['user'] },
    );
  }

  async removeByAccessToken(token: string, userId: string): Promise<void> {
    await this.entityManager.delete(UserRefreshTokenModel, {
      accessToken: token,
      user: { id: userId },
    });
  }

  async remove(token: string): Promise<void> {
    await this.entityManager.delete(UserRefreshTokenModel, {
      token,
    });
  }

  async update(where: any, data: Partial<UserRefreshToken>): Promise<void> {
    await this.entityManager.update(UserRefreshTokenModel, where, data);
  }

  async create(data: Partial<UserRefreshToken>): Promise<UserRefreshToken> {
    return this.entityManager.save(UserRefreshTokenModel, data);
  }
}
