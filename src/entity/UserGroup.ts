import { Column, Entity, ManyToOne } from 'typeorm';
import { Group } from './Group';
import { User } from './User';

@Entity()
export class UserGroup {
  constructor(user: User, group: Group) {
    this.group = group;
    this.user = user;
  }
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinDate: Date;

  @ManyToOne(() => User, (user) => user.userGroups, { primary: true })
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups, { primary: true })
  group: Group;
}
