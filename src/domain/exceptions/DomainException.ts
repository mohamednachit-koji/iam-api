export class DomainException extends Error {
  type = 'DOMAIN';
  constructor(message: string) {
    super(message);
  }
}
