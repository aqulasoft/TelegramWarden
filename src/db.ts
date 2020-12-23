import { Connection, createConnection, Repository } from 'typeorm';
import { User } from './entity/User';
import { Chat } from './entity/Chat';
import { Chat as TChat, User as TUser } from 'telegraf/typings/telegram-types';
import 'reflect-metadata';
import { ChatUser } from './entity/ChatUser';
import { UpdateUserOptions } from './types/twardenBotTypes';

let connection: Connection;
let userRepo: Repository<User>;
let chatRepo: Repository<Chat>;
let chatUserRepo: Repository<ChatUser>;

createConnection()
  .then((conn) => {
    connection = conn;
    userRepo = conn.getRepository(User);
    chatRepo = conn.getRepository(Chat);
    chatUserRepo = conn.getRepository(ChatUser);
  })
  .catch((error) => console.log('Error: ', error));

function hasDbConnection() {
  return chatRepo && userRepo && chatUserRepo;
}

async function getChatUser(userId, chatId) {
  return await chatUserRepo
    .createQueryBuilder('chatUser')
    .where('chatUser.chat = :chatId And chatUser.user = :userId', {
      chatId: chatId,
      userId: userId,
    })
    .innerJoinAndSelect('chatUser.chat', 'chat')
    .leftJoinAndSelect('chatUser.user', 'user')
    .getOne();
}

export async function updateUser(
  tUser: TUser,
  tChat: TChat,
  options?: UpdateUserOptions,
) {
  if (!hasDbConnection()) return;
  let chatUser = await getChatUser(tUser.id, tChat.id);
  options = options || {};

  console.log('====================================');
  console.log(chatUser);
  console.log('====================================');

  if (!chatUser) {
    const chat = new Chat(tChat);
    await chatRepo.save(chat);
    const user = new User(tUser);
    await userRepo.save(user);
    chatUser = new ChatUser(user, chat);
  }
  if (chatUser.leftDate) chatUser.leftDate = null;
  if (options.hasViolation) {
    chatUser.violationCount++;
    chatUser.messageCount++;
  }
  if (options.newMessage) chatUser.messageCount++;
  if (options.leftChat) chatUser.leftDate = new Date();

  await chatUserRepo.save(chatUser);
}
