import { config } from 'dotenv';
import translatte from 'translatte';
import { Telegraf } from 'telegraf';

config();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('Response time: %sms', ms);
});

const reg = new RegExp(/^([^\s|]{1,5})\|\|(.+)/);

bot.on('text', (ctx) => {
  console.log(
    `----------- new msg [${ctx.from.username} - ${ctx.chat.title}] -------------`,
  );
  console.log(ctx.message);

  const matches = reg.exec(ctx.message.text);
  console.log(matches);

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
    translatte(ctx.message.text, { to: process.env.TO_TRANSLATE })
      .then((result) => {
        console.log(result);
        if (result.from.language.iso !== process.env.TO_TRANSLATE) {
          ctx.reply(
            `${result.from.language.iso} => ${process.env.TO_TRANSLATE}| ${result.text}`,
            {
              reply_to_message_id: ctx.message.message_id,
            },
          );
        }
      })
      .catch(console.error);
  }
});

bot.launch();
