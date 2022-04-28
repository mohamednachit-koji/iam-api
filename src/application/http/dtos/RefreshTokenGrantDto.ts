import { TokenExchangeDto } from './TokenExchangeDto';

export class RefreshTokenGrantDto extends TokenExchangeDto {
  refresh_token: string;
  grant_type = 'refresh_token';
}
