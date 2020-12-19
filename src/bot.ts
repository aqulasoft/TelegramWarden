import { config } from 'dotenv';
import translatte from 'translatte';
import { Telegraf } from 'telegraf';
import { containsUrl } from './utils/utils';
import { updateUser } from './db';
import 'reflect-metadata';

config();

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date().getTime() - start.getTime();
  console.log('Response time: %sms', ms);
});

const reg = new RegExp(/^([^\s|]{1,5})\|\|(.+)/);

bot.on('photo', (ctx) => {
  if (ctx.message.chat.title && Boolean(process.env.DENY_PHOTO || 'true'))
    ctx.deleteMessage(ctx.message.message_id);
});

bot.on('text', async (ctx) => {
  await updateUser(ctx.message.from, ctx.message.chat);
  if (ctx.message.chat.title) {
    const hasUrl =
      Boolean(process.env.DENY_URL || 'true') && containsUrl(ctx.message.text);
    const tooLong =
      ctx.message.text.length > Number(process.env.MAX_MSG_LENGTH || '1000');
    if (hasUrl || tooLong) {
      ctx.deleteMessage(ctx.message.message_id);
      return;
    }
  }

  console.log(
    `----------- new msg [${ctx.from.username} - ${ctx.chat.title}] -------------`,
  );
  console.log(ctx.message);

  const matches = reg.exec(ctx.message.text);

  if (matches) {
    translatte(matches[2], { to: matches[1] })
      .then((result) => {
        console.log(`translate to : ${matches[1]}`);
        ctx.reply(
          `${result.from.language.iso} => ${matches[1]}| ${result.text}`,
          {
            reply_to_message_id: ctx.message.message_id,
          },
        );
      })
      .catch(console.error);
  } else {
    const lang = process.env.TO_TRANSLATE || 'en';
    translatte(ctx.message.text, { to: lang })
      .then((result) => {
        console.log(result);
        if (result.from.language.iso !== lang) {
          ctx.reply(`${result.from.language.iso} => ${lang}| ${result.text}`, {
            reply_to_message_id: ctx.message.message_id,
          });
        }
      })
      .catch(console.error);
  }
});

bot.launch();
