import { ClientRequestDto } from './ClientRequestDto';

export class TokenExchangeDto extends ClientRequestDto {
  grant_type: string;
}
