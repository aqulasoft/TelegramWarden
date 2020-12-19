import { Chat } from 'telegraf/typings/telegram-types';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserGroup } from './UserGroup';

@Entity()
export class Group {
  constructor(chat: Chat) {
    if (chat) {
      this.id = String(chat.id);
      this.title = chat.title;
      this.username = chat.username;
      this.type = chat.type;
      this.description = chat.description;
    }
  }

  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  username: string;

  @Column()
  type: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];
}
