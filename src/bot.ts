require('dotenv').config();

const { Telegraf, Extra } = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log('Response time: %sms', ms);
});

const translatte = require('translatte');


bot.on('text', (ctx) => {
  console.log(
    `----------- new msg [${ctx.from.username} - ${ctx.chat.title}] -------------`,
  );
  console.log(ctx.message);

  translatte(ctx.message.text, { to: process.env.TO_TRANSLATE })
    .then((result) => {
      console.log(result);
      if (result.from.language.iso !== process.env.TO_TRANSLATE) {

        ctx.reply(`${result.from.language.iso}| ${result.text}`, {
          reply_to_message_id: ctx.message_id,
        });
      }
    })
    .catch(console.error);
});

bot.launch();
