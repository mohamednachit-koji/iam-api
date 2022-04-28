import { AbstractEntity } from './AbstractEntity';

export class UserAddress extends AbstractEntity {
  city: string;
  postCode: number;
  street: string;
}
