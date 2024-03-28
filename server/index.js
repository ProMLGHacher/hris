import express from "express";
import { sql } from "./db.js";
import { register } from "./controllers/register.js";
import { auth } from "./controllers/auth.js";
import { roleMiddleware } from "./middlewares/roleMiddleware.js";
import cors from 'cors'
import jwt from 'jsonwebtoken'
import './modules/telegram.js'
import { sendMessageToAdmins, startTelegramBot } from "./modules/telegram.js";

//порт на котором будет работать сервер
const PORT = 3000

//сама переменная сервера
const app = express()

//чтобы сервер понимал json
app.use(express.json())
app.use(cors())

app.get('/', roleMiddleware(["ADMIN"]), async (req, res) => {
    const data = await sql`select * from Users`
    res.send(data)
})

//ветка регистрации
app.post('/reg', register)
//ветка логина
app.post('/auth', auth)

app.get('/news', async (req, res) => {
    const news = await sql`select * from News`
    return res.send(news)
})
app.post('/news', async (req, res) => {
    const temp = req.body
    await sql`insert into News(title, description, date) values(${temp.title}, ${temp.description}, ${Date.now()})`
    return res.send(200)
})

// GET запрос для получения всех категорий услуг
app.get('/categories', async (req, res) => {
    try {
        const categories = await sql`SELECT * FROM Categories`;
        res.json(categories);
    } catch (error) {
        console.error('Ошибка при получении категорий услуг:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// POST запрос для создания новой категории услуг
app.post('/categories', async (req, res) => {
    const { name } = req.body;
    try {
        await sql`INSERT INTO Categories (name) VALUES (${name})`;
        res.status(201).json({ message: 'Категория успешно создана' });
    } catch (error) {
        console.error('Ошибка при создании категории услуг:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// GET запрос для получения всех услуг
app.get('/services', async (req, res) => {
    try {
        const services = await sql`SELECT * FROM Services`;
        res.json(services);
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// POST запрос для создания новой услуги
app.post('/services', roleMiddleware(['ADMIN']), async (req, res) => {
    const { title, description, category_id, price } = req.body;
    try {
        await sql`INSERT INTO Services (title, description, category_id, price) VALUES (${title}, ${description}, ${category_id}, ${price})`;
        res.status(201).json({ message: 'Услуга успешно создана' });
    } catch (error) {
        console.error('Ошибка при создании услуги:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// GET запрос для получения всех заказов
app.get('/orders', roleMiddleware(["USER", "ADMIN"]), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { role, id: userId } = jwt.verify(token, "SECRET_KEY")

    try {
        if (role == "USER") {
            const orders = await sql`SELECT * FROM Orders where user_id = ${userId}`;
            res.json(orders);
        } else {
            const orders = await sql`SELECT * FROM Orders`;
            res.json(orders);
        }
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// POST запрос для создания нового заказа
app.post('/orders', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { id: user_id } = jwt.verify(token, "SECRET_KEY")
    const { service_id } = req.body;
    const order_date = Date.now()
    try {
        await sql`INSERT INTO Orders (user_id, service_id, order_date) VALUES (${user_id}, ${service_id}, ${order_date})`;
        sendMessageToAdmins("У вас заказали кое что")
        res.status(201).json({ message: 'Заказ успешно создан' });
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});


//функция старта приложения
const start = async () => {
    //создаем таблицы
    await sql`create table if not exists Roles(
        role varchar(100) unique primary key
    )`
    await sql`create table if not exists Users(
        id SERIAL PRIMARY KEY NOT NULL,
        login varchar(100) NOT NULL,
        role varchar(100),
        password varchar(250),
        telegramChatId INT,
        FOREIGN KEY (role) REFERENCES Roles(role)
    )`
    await sql`CREATE TABLE IF NOT EXISTS News (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        date DATE
    );`

    await sql`CREATE TABLE IF NOT EXISTS Categories (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL
        );`

    await sql`CREATE TABLE IF NOT EXISTS Services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT,
        category_id INT,
        price DECIMAL(10,2),
        FOREIGN KEY (category_id) REFERENCES Categories(id)
        );`

    await sql`CREATE TABLE IF NOT EXISTS Orders(
        id SERIAL PRIMARY KEY,
        user_id INT,
        service_id INT,
        order_date DATE,
        FOREIGN KEY(user_id) REFERENCES Users(id),
        FOREIGN KEY(service_id) REFERENCES Services(id)
    );`


    try {
        await sql`insert into Roles(role) values('USER')`
        await sql`insert into Roles(role) values('ADMIN')`
    } catch (error) {
        console.log('Роли уже существуют в системе');
    }

    startTelegramBot()

    //запустить сервак
    //(прослушивать порт на запросы)
    //вторым аргументом функция которая запустится при успешном запуске сервака
    app.listen(PORT, () => {
        console.log(`СЕРВАК ФУРЫЧИТ ТУТ http://localhost:${PORT}`);
    })
}

start()