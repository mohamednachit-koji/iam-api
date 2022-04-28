import { ClientRequestDto } from './ClientRequestDto';

export class RevokeTokenDto extends ClientRequestDto {
  token: string;
}
