import { UserAccess } from 'domain/entities/UserAccess';

export class UserAccessDto {
  id_token: string;
  access_token: string;
  refresh_token: string;
  expires_in: number;

  static fromEntity(entity: UserAccess) {
    return {
      id_token: entity.idToken,
      access_token: entity.accessToken,
      refresh_token: entity.refreshToken,
      expires_in: entity.expiresIn,
    };
  }
}
