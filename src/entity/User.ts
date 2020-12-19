import { User as TUser } from 'telegraf/typings/telegram-types';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { UserChat } from './UserChat';

@Entity()
export class User {
  constructor(user: TUser) {
    if (user) {
      this.id = user.id.toString();
      this.username = user.username;
      this.firstname = user.first_name;
      this.lastname = user.last_name;
      this.lang = user.language_code;
      this.isBot = user.is_bot || false;
    }
  }

  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname: string;

  @Column({ nullable: true })
  lang: string;

  @Column()
  isBot: boolean;

  @OneToMany(() => UserChat, (userChat) => userChat.user)
  userChats: UserChat[];
}
