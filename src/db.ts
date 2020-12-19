import { Connection, createConnection, Repository } from 'typeorm';
import { User } from './entity/User';
import { Group } from './entity/Group';
import { Chat, User as TUser } from 'telegraf/typings/telegram-types';
import 'reflect-metadata';
import { UserGroup } from './entity/UserGroup';

let connection: Connection;
let userRepo: Repository<User>;
let groupRepo: Repository<Group>;
let userGroupRepo: Repository<UserGroup>;

createConnection()
  .then((conn) => {
    connection = conn;
    userRepo = conn.getRepository(User);
    groupRepo = conn.getRepository(Group);
    userGroupRepo = conn.getRepository(UserGroup);
  })
  .catch((error) => console.log('Error: ', error));

export async function updateUser(tUser: TUser, chat: Chat) {
  if (!groupRepo || !userRepo || !userGroupRepo) {
    return;
  }

  const userGroup = await userGroupRepo
    .createQueryBuilder('userGroup')
    .where('userGroup.group = :groupId And userGroup.user = :userId', {
      groupId: chat.id,
      userId: tUser.id,
    })
    .innerJoinAndSelect('userGroup.group', 'group')
    .leftJoinAndSelect('userGroup.user', 'user')
    .getOne();

  console.log('====================================');
  console.log(userGroup);
  console.log('====================================');
  if (!userGroup) {
    const group = new Group(chat);
    await groupRepo.save(group);
    const user = new User(tUser);
    await userRepo.save(user);
    await userGroupRepo.save(new UserGroup(user, group));
  }
}
