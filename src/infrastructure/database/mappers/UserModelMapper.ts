import { User } from 'domain/entities/User';
import { UserModel } from '../models/UserModel';

import { Injectable } from '@nestjs/common';

@Injectable()
export class UserModelMapper {
  modelToEntity(model: UserModel): User {
    return model;
  }
}
