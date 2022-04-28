import { TokenExchangeDto } from './TokenExchangeDto';

export class PasswordGrantDto extends TokenExchangeDto {
  username: string;
  password: string;
  grant_type = 'password';
}
