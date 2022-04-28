import { User } from 'domain/entities/User';
import { AddressDto } from './AddressDto';

export class UserInfoDto {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  birth_date: Date;
  phone: string;
  nickname: string;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  user_roles: string[];
  address: AddressDto;

  static fromEntity(user: User) {
    return {
      email: user.email,
      email_verified: user.emailVerified,
      family_name: user.familyName,
      given_name: user.givenName,
      birth_date: user.birthDate,
      phone: user.phone,
      nickname: `${user.givenName}${user.familyName}`,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      user_id: user.id,
      user_roles: user.roles.map((role) => role.name),
      address: user.address,
    };
  }
}
