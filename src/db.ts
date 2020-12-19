import { Connection, createConnection, Repository } from 'typeorm';
import { User } from './entity/User';
import { Chat } from './entity/Chat';
import { Chat as TChat, User as TUser } from 'telegraf/typings/telegram-types';
import 'reflect-metadata';
import { UserChat } from './entity/UserChat';

let connection: Connection;
let userRepo: Repository<User>;
let chatRepo: Repository<Chat>;
let userChatRepo: Repository<UserChat>;

createConnection()
  .then((conn) => {
    connection = conn;
    userRepo = conn.getRepository(User);
    chatRepo = conn.getRepository(Chat);
    userChatRepo = conn.getRepository(UserChat);
  })
  .catch((error) => console.log('Error: ', error));

export async function updateUser(tUser: TUser, tChat: TChat) {
  if (!chatRepo || !userRepo || !userChatRepo) {
    return;
  }

  const userChat = await userChatRepo
    .createQueryBuilder('userChat')
    .where('userChat.chat = :chatId And userChat.user = :userId', {
      chatId: tChat.id,
      userId: tUser.id,
    })
    .innerJoinAndSelect('userChat.chat', 'chat')
    .leftJoinAndSelect('userChat.user', 'user')
    .getOne();

  console.log('====================================');
  console.log(userChat);
  console.log('====================================');
  if (!userChat) {
    const chat = new Chat(tChat);
    await chatRepo.save(chat);
    const user = new User(tUser);
    await userRepo.save(user);
    await userChatRepo.save(new UserChat(user, chat));
  }
}
