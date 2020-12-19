FROM node:12

WORKDIR /usr/src/twarden

COPY . .

RUN npm install
RUN npm install -g typescript

RUN node_modules/typescript/bin/tsc -p .

RUN npm run update-database || true

CMD ["node", "./dist/bot.js"]

