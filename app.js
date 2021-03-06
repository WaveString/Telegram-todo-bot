'use strict';

const Telegram = require('telegram-node-bot');
const PersistentMemoryStorage = require('./adapters/PersistentMemoryStorage');
const TextCommand = Telegram.TextCommand;
const TodoController = require('./controllers/todo');
const OtherwiseController = require('./controllers/otherwise');
const TOKEN = process.env.TOKEN;


const storage = new PersistentMemoryStorage(
    `${__dirname}/data/userData.json`,
    `${__dirname}/data/chatData.json`
);

const tg = new Telegram.Telegram(TOKEN, {
    workers: 1,
    storage
});

tg.router
    .when(new TextCommand('add', 'addCommand'), new TodoController())
    .when(new TextCommand('list', 'listCommand'), new TodoController())
    .when(new TextCommand('check', 'checkCommand'), new TodoController())
    .otherwise(new OtherwiseController());

function exitHandler(exitCode) {
    storage.flush();
    process.exit(exitCode);
}

process.on('SIGINT', exitHandler.bind(null, 0));
process.on('uncauthExeption', exitHandler.bind(null, 1));

