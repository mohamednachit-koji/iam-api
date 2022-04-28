import { Role } from './Role';
import { AbstractEntity } from './AbstractEntity';
import { UserAddress } from './UserAddress';

export class User extends AbstractEntity {
  username: string;
  enabled: boolean;
  password: string;
  salt: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  givenName: string;
  familyName: string;
  birthDate: Date;
  gender: string;
  resetPasswordToken: string;
  address: UserAddress;
  roles: Role[];
}
