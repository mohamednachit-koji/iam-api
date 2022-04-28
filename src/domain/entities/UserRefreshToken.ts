import { AbstractEntity } from './AbstractEntity';
import { User } from './User';

export class UserRefreshToken extends AbstractEntity {
  user: User;
  expiry: Date;
  accessToken: string;
  token: string;
}
