import { config } from 'dotenv';
import translatte from 'translatte';
import { Telegraf } from 'telegraf';
import { containsUrl } from './utils/utils';
import { updateUser } from './db';
import { TelegrafContext } from 'telegraf/typings/context';
import 'reflect-metadata';
import { User } from './entity/User';
import { resolve } from 'path';
import { ChatMember } from 'telegraf/typings/telegram-types';

config();
const env = process.env;
const reg = new RegExp(/^([^\s|]{1,5})\|\|(.+)/);

async function onPhoto(ctx: TelegrafContext) {
  if (ctx.message.chat.title && Boolean(env.DENY_PHOTO || 'true'))
    ctx.deleteMessage(ctx.message.message_id);
}

async function onText(ctx: TelegrafContext) {
  await checkIfAdmin(ctx).then(async (isAdmin: Boolean) => {
    await handleMessage(ctx, isAdmin);
  });
}

async function handleMessage(ctx: TelegrafContext, isAdmin: Boolean) {
  const msg = ctx.message;
  await updateUser(msg.from, msg.chat);
  if (!isAdmin) {
    const hasUrl = Boolean(env.DENY_URL || 'true') && containsUrl(msg.text);
    const tooLong = msg.text.length > Number(env.MAX_MSG_LENGTH || '1000');
    if (hasUrl || tooLong) {
      ctx.deleteMessage(msg.message_id);
      return;
    }
  }

  console.log(
    `----------- new msg [${ctx.from.username} - ${ctx.chat.title}] -------------`,
  );
  console.log(msg);

  const matches = reg.exec(msg.text);

  if (matches) {
    translatte(matches[2], { to: matches[1] })
      .then((result) => {
        console.log(`translate to : ${matches[1]}`);
        ctx.reply(
          `${result.from.language.iso} => ${matches[1]}| ${result.text}`,
          {
            reply_to_message_id: msg.message_id,
          },
        );
      })
      .catch(console.error);
  } else {
    const lang = env.TO_TRANSLATE || 'en';
    translatte(msg.text, { to: lang })
      .then((result) => {
        console.log(result);
        if (
          result.from.language.iso !== lang &&
          result.text.toLowerCase() !== msg.text.toLowerCase()
        ) {
          ctx.reply(`${result.from.language.iso} => ${lang}| ${result.text}`, {
            reply_to_message_id: msg.message_id,
          });
        }
      })
      .catch(console.error);
  }
}
async function checkIfAdmin(ctx: TelegrafContext) {
  return new Promise((resolve, reject) => {
    if (ctx.from.id === ctx.chat.id) resolve(true); // if not group chat.id == user.id
    ctx
      .getChatAdministrators()
      .then((users: Array<ChatMember>) => {
        users.forEach((user: ChatMember) => {
          if (user.user.id === ctx.message.from.id) {
            resolve(true);
          }
        });
        resolve(false);
      })
      .catch(reject);
  });
}

const bot = new Telegraf(env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date().getTime() - start.getTime();
  console.log('Response time: %sms', ms);
});

bot.on('photo', onPhoto);

bot.on('text', onText);

bot.launch();
