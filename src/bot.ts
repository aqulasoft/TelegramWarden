import { config } from 'dotenv';
import translatte from 'translatte';
import { Telegraf } from 'telegraf';
import { containsUrl } from './utils/utils';
import { updateUser } from './db';
import { TelegrafContext } from 'telegraf/typings/context';
import 'reflect-metadata';
import { ChatMember } from 'telegraf/typings/telegram-types';

config();
const env = process.env;
const reg = new RegExp(/^([^\s|]{1,5})\|\|(.+)/);

async function onPhoto(ctx: TelegrafContext) {
  const msg = ctx.message;
  if (msg.chat.title && Boolean(env.DENY_PHOTO || 'true'))
    ctx.deleteMessage(msg.message_id);
  await updateUser(msg.from, msg.chat, { hasViolation: true });
}

async function onText(ctx: TelegrafContext) {
  await checkIfAdmin(ctx).then(async (isAdmin: Boolean) => {
    await handleMessage(ctx, isAdmin);
  });
}

async function onNewChatMembers(ctx: TelegrafContext) {
  const msg = ctx.message;
  msg.new_chat_members.forEach(async (user) => {
    await updateUser(user, msg.chat);
  });
}

async function onMemberLeft(ctx: TelegrafContext) {
  const msg = ctx.message;
  await updateUser(msg.from, msg.chat, { leftChat: true });
}

async function handleMessage(ctx: TelegrafContext, isAdmin: Boolean) {
  const msg = ctx.message;
  if (!isAdmin) {
    const hasUrl = Boolean(env.DENY_URL || 'true') && containsUrl(msg.text);
    const tooLong = msg.text.length > Number(env.MAX_MSG_LENGTH || '1000');
    if (hasUrl || tooLong) {
      ctx.deleteMessage(msg.message_id);
      await updateUser(msg.from, msg.chat, { hasViolation: true });
      return;
    }
  }
  await updateUser(msg.from, msg.chat, { newMessage: true });

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

bot.on('new_chat_members', onNewChatMembers);

bot.on('left_chat_member', onMemberLeft);

bot.on('photo', onPhoto);

bot.on('text', onText);

// bot.on('sticker', (ctx) => console.log(ctx.message));

bot.launch();
