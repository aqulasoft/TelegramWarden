import { Chat as TChat } from 'telegraf/typings/telegram-types';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserChat } from './UserChat';

@Entity()
export class Chat {
  constructor(chat: TChat) {
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

  @OneToMany(() => UserChat, (userChat) => userChat.chat)
  userChats: UserChat[];
}
