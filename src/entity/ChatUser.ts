import { Column, Entity, ManyToOne } from 'typeorm';
import { Chat } from './Chat';
import { User } from './User';

@Entity()
export class ChatUser {
  constructor(user: User, chat: Chat) {
    this.user = user;
    this.chat = chat;
    this.messageCount = 0;
    this.violationCount = 0;
    this.leftDate = null;
    this.joinDate = new Date();
  }
  @Column({ type: 'timestamp' })
  joinDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  leftDate: Date;

  @Column()
  messageCount: number;

  @Column()
  violationCount: number;

  @ManyToOne(() => User, (user) => user.chatUsers, { primary: true })
  user: User;

  @ManyToOne(() => Chat, (chat) => chat.chatUsers, { primary: true })
  chat: Chat;
}
