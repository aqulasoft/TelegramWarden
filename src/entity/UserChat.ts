import { Column, Entity, ManyToOne } from 'typeorm';
import { Chat } from './Chat';
import { User } from './User';

@Entity()
export class UserChat {
  constructor(user: User, chat: Chat) {
    this.user = user;
    this.chat = chat;
  }
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  joinDate: Date;

  @ManyToOne(() => User, (user) => user.userChats, { primary: true })
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.userChats, { primary: true })
  chat: Chat;
}
