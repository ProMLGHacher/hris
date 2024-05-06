import express from "express";
import { sql } from "./db.js";
import { register } from "./controllers/register.js";
import { auth } from "./controllers/auth.js";
import { roleMiddleware } from "./middlewares/roleMiddleware.js";
import cors from 'cors'
import jwt from 'jsonwebtoken'
import './modules/telegram.js'
import { sendMessageToAdmins, startTelegramBot } from "./modules/telegram.js";
import multer from "multer";
import path from 'path'

//порт на котором будет работать сервер
const PORT = 3000

//сама переменная сервера
const app = express()

//чтобы сервер понимал json
app.use(express.json())
app.use(cors())

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/avatars'); // Upload avatar files to the 'uploads/avatars' directory
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep the original filename
    }
});

// Multer file filter to allow only image files
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

app.get('/', roleMiddleware(["ADMIN"]), async (req, res) => {
    const data = await sql`select * from Users`
    res.send(data)
})

//ветка регистрации
app.post('/reg', register)
//ветка логина
app.post('/auth', auth)

app.get('/profile', roleMiddleware(["USER", "ADMIN"]), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { id: user_id } = jwt.verify(token, "SECRET_KEY")
    const user = (await sql`select * from Users where id = ${user_id}`)[0]
    return res.send(user)
})

app.put('/profile', roleMiddleware(["USER", "ADMIN"]), upload.single('avatar'), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { id: userId } = jwt.verify(token, "SECRET_KEY")
    const avatar = req.file ? req.file.filename : null;

    try {
        await sql`
            UPDATE Users
            SET avatar = ${avatar}
            WHERE id = ${userId}
        `;

        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
});

app.patch('/profile', roleMiddleware(["USER", "ADMIN"]), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { id: userId } = jwt.verify(token, "SECRET_KEY")
    const { name, lastname, email } = req.body

    try {
        if (name) {
            await sql`
                UPDATE Users
                SET name = ${name}
                WHERE id = ${userId}
            `;
        }
        if (lastname) {
            await sql`
                UPDATE Users
                SET lastname = ${lastname}
                WHERE id = ${userId}
            `;
        }
        if (email) {
            await sql`
                UPDATE Users
                SET email = ${email}
                WHERE id = ${userId}
            `;
        }

        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
});

app.get('/avatars/:filename', (req, res) => {
    const filename = req.params.filename;
    const avatarPath = path.join(process.cwd(), '/uploads/avatars/', filename); // Assuming avatars are stored in the 'uploads/avatars' directory

    // Send the avatar file
    res.sendFile(avatarPath);
});


// id SERIAL PRIMARY KEY,
// title VARCHAR(100) NOT NULL,
// description TEXT NOT NULL,
// date DATE NOT NULL,
// href varchar(200) NOT NULL,
// category varchar(50) NOT NULL
app.get('/news', async (req, res) => {
    const news = await sql`select * from News`
    return res.send(news)
})
app.post('/news', roleMiddleware(["ADMIN"]), async (req, res) => {
    const temp = req.body
    if (!temp.title) return res.status(400).send({
        message: 'title is reqired'
    })
    if (!temp.description) return res.status(400).send({
        message: 'description is reqired'
    })
    if (!temp.href) return res.status(400).send({
        message: 'href is reqired'
    })
    if (!temp.category) return res.status(400).send({
        message: 'category is reqired'
    })
    await sql`insert into News(title, description, date, href, category) values(${temp.title}, ${temp.description}, ${Date.now()}, ${temp.href}, ${temp.category})`
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
    if (!name) return res.status(400).send({
        message: 'name is reqired'
    })
    try {
        const pot = await sql`SELECT * FROM Categories where name = (${name})`;
        if (pot.length > 0) return res.status(409).send()
        await sql`INSERT INTO Categories (name) VALUES (${name})`;
        res.status(201).json({ message: 'Категория успешно создана' });
    } catch (error) {
        console.error('Ошибка при создании категории услуг:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// GET запрос для получения всех услуг
app.get('/services', async (req, res) => {
    const category_id = req.query.category
    try {
        if (category_id) {
            const services = await sql`SELECT * FROM Services where category_id = ${category_id}`;
            res.json(services);
        } else {
            const services = await sql`SELECT * FROM Services`;
            res.json(services);
        }
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.get('/services/:id', async (req, res) => {
    const service_id = req.params.id
    try {
        const services = await sql`SELECT * FROM Services where id = ${service_id}`;
        res.json(services[0]);
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// POST запрос для создания новой услуги
app.post('/services', roleMiddleware(['ADMIN']), upload.single('image'), async (req, res) => {
    const { title, description, category_id, price } = req.body;
    const avatar = req.file ? req.file.filename : null;

    if (!title) return res.status(400).send({
        message: 'title is reqired'
    })
    if (!description) return res.status(400).send({
        message: 'description is reqired'
    })
    if (!category_id) return res.status(400).send({
        message: 'category_id is reqired'
    })
    if (!price) return res.status(400).send({
        message: 'price is reqired'
    })
    try {
        await sql`INSERT INTO Services (title, description, category_id, price, image) VALUES (${title}, ${description}, ${category_id}, ${price}, ${avatar})`;
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
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const user = (await sql`SELECT * FROM Users where id = ${order.user_id}`)[0]
                const service = (await sql`SELECT * FROM Services where id = ${order.service_id}`)[0]
                orders[i].user = user
                orders[i].service = service

                delete orders[i].user.password
                delete orders[i].user.telegramchatid
            }
            res.json(orders);
        } else {
            const orders = await sql`SELECT * FROM Orders`;
            for (let i = 0; i < orders.length; i++) {
                const order = orders[i];
                const user = (await sql`SELECT * FROM Users where id = ${order.user_id}`)[0]
                const service = (await sql`SELECT * FROM Services where id = ${order.service_id}`)[0]
                orders[i].user = user
                orders[i].service = service

                delete orders[i].user.password
                delete orders[i].user.telegramchatid
            }
            res.json(orders);
        }
    } catch (error) {
        console.error('Ошибка при получении заказов:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// POST запрос для создания нового заказа
app.post('/orders', roleMiddleware(["ADMIN", "USER"]), async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { service_id, adress, email, lastname, message, name, phone } = req.body;
    if (!service_id) return res.status(400).send({
        message: 'service_id is reqired'
    })
    const order_date = Date.now()
    try {
        const { id: user_id } = jwt.verify(token, "SECRET_KEY")
        await sql`INSERT INTO Orders (user_id, service_id, order_date, adress, email, lastname, message, name, phone) VALUES (${user_id}, ${service_id}, ${order_date}, ${adress}, ${email}, ${lastname}, ${message}, ${name}, ${phone})`;
        sendMessageToAdmins(`
            Новый заказ от ${req.body.name}! \n
            Его email: ${req.body.email} \n
            Адресс: ${req.body.adress} \n
            Телефон: ${req.body.phone} \n
            Сообщение от ${req.body.name}: ${req.body.message} \n
        `)
        res.status(201).json({ message: 'Заказ успешно создан' });
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

// POST запрос для изменения статуса заказа
app.patch('/orders', roleMiddleware(["ADMIN"]), async (req, res) => {
    const { order_id, status } = req.body;
    try {
        await sql`UPDATE Orders SET status = ${status} WHERE id = ${order_id};`
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
});

app.post('/bid', async (req, res) => {
    const { name, email, message } = req.body
    if (!name) return res.status(400).send({
        message: 'name is reqired'
    })
    if (!email) return res.status(400).send({
        message: 'email is reqired'
    })
    if (!message) return res.status(400).send({
        message: 'message is reqired'
    })

    sendMessageToAdmins(`
        Новый запрос от ${name}! \nЕго email: ${email} \nСообщение от ${name}: ${message}`)

    res.send(200)
})


//функция старта приложения
const start = async () => {
    //создаем таблицы
    await sql`create table if not exists Roles(
        role varchar(100) unique primary key
    )`
    await sql`create table if not exists Users(
        id SERIAL PRIMARY KEY NOT NULL,
        login varchar(100) NOT NULL,
        name varchar(100),
        lastname varchar(100),
        email varchar(100),
        role varchar(100),
        password varchar(250),
        avatar varchar(250),
        telegramChatId INT,
        FOREIGN KEY (role) REFERENCES Roles(role)
    )`
    await sql`CREATE TABLE IF NOT EXISTS News (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        href varchar(200) NOT NULL,
        category varchar(50) NOT NULL
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
        price INT,
        image varchar(100),
        FOREIGN KEY (category_id) REFERENCES Categories(id)
        );`


    await sql`CREATE TABLE IF NOT EXISTS Orders(
        id SERIAL PRIMARY KEY,
        user_id INT,
        service_id INT,
        order_date DATE,
        status varchar(100) DEFAULT 'pending',
        adress varchar(100),
        email varchar(100),
        lastname varchar(100),
        message varchar(100),
        name varchar(100),
        phone varchar(100),
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