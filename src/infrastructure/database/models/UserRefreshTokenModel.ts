import { UserModel } from './../models/UserModel';
import { Column, Entity, ManyToOne } from 'typeorm';
import { AbstractModel } from './AbstractModel';

@Entity({ name: 'au_refresh_token' })
export class UserRefreshTokenModel extends AbstractModel {
  @ManyToOne(() => UserModel)
  user: UserModel;

  @Column({ type: 'timestamp' })
  expiry: Date;

  @Column({ type: 'text' })
  accessToken: string;

  @Column()
  token: string;
}
