import { Column, Entity } from 'typeorm';
import { AbstractModel } from './AbstractModel';

@Entity({ name: 'au_userAddress' })
export class UserAddressModel extends AbstractModel {
  @Column()
  city: string;

  @Column()
  postCode: number;

  @Column()
  street: string;
}
