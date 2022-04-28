import { Column, Entity } from 'typeorm';
import { AbstractModel } from './AbstractModel';

@Entity({ name: 'au_role' })
export class RoleModel extends AbstractModel {
  @Column()
  name: string;
}
