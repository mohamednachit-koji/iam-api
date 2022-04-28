import { RoleModel } from './RoleModel';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { AbstractModel } from './AbstractModel';
import { UserAddressModel } from './UserAddressModel';

@Entity({ name: 'au_user' })
export class UserModel extends AbstractModel {
  @Column()
  username: string;

  @Column({ default: true })
  enabled: boolean;

  @Column()
  password: string;

  @Column()
  salt: string;

  @Column()
  email: string;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: false })
  phoneVerified: boolean;

  @Column()
  givenName: string;

  @Column()
  familyName: string;

  @Column({ nullable: true })
  birthDate: Date;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  resetPasswordToken: string;

  @OneToOne(() => UserAddressModel)
  @JoinColumn()
  address: UserAddressModel;

  @ManyToMany(() => RoleModel)
  @JoinTable({ name: 'au_user_role' })
  roles: RoleModel[];
}
