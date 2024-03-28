import TelegramBot from "node-telegram-bot-api"
import { sql } from "../db.js"
import bcrypt from 'bcryptjs'

const token = '6823669714:AAH4fkggO7vp9AxKrUSEHKScyoCMXXyovd8'

let bot = undefined;
let users = undefined
let autorizedUsersChatIds = undefined

export const sendMessageToAdmins = (msg) => {
    if (!bot) return
    if (!users) return
    if (!autorizedUsersChatIds) return
    autorizedUsersChatIds.forEach(chId => {
        bot.sendMessage(chId, msg)
    })
}

export const startTelegramBot = async () => {


    users = await sql`select * from Users where telegramChatId is not null`
    autorizedUsersChatIds = users.map(el => el.telegramchatid)

    console.log(autorizedUsersChatIds);

    bot = new TelegramBot(token, { polling: true })

    bot.onText(/\/echo (.+)/, (msg, match) => {
        const chatId = msg.chat.id;
        const resp = match[1];
        console.log(msg);
        console.log(match);
        bot.sendMessage(chatId, resp);
    });

    bot.onText(/\/config (.+)/, async (msg, match) => {
        const chatId = msg.chat.id;
        const text = match[1];
        const username = match[1].split(' ')[0];
        const password = match[1].split(' ')[1];


        if (text.split(' ').length != 2) return bot.sendMessage(chatId, 'Конфиг должен быть формата /config [login] [password]')

        const user = await sql`select * from Users where login = ${username} AND role = 'ADMIN'`

        if (!user[0]) return bot.sendMessage(chatId, `Пользователь ${username} не найден`)

        const validPassword = bcrypt.compareSync(password, user[0].password)

        if (!validPassword) {
            return bot.sendMessage(chatId, `Введен неверный пароль`)
        }

        await sql`UPDATE Users SET telegramChatId = ${chatId} WHERE login = ${username} ;`
        autorizedUsersChatIds.push(chatId)

        bot.sendMessage(chatId, 'Конфиг успешно сохранен');
    });

    bot.on('message', (msg, match) => {
        if (msg.entities?.at(0).type == "bot_command") return

        const chatId = msg.chat.id;
        console.log(msg);
        console.log(match);
        bot.sendMessage(chatId, 'Received your message');
    });
}