import express from "express";
import { sql } from "./db.js";
import { register } from "./controllers/register.js";
import { auth } from "./controllers/auth.js";
import { roleMiddleware } from "./middlewares/roleMiddleware.js";
import cors from 'cors'
import './modules/telegram.js'
import { startTelegramBot } from "./modules/telegram.js";
import { upload } from "./utils/multer.js";
import { profile } from "./controllers/profile/profile.js";
import { putAvatar } from "./controllers/profile/putAvatar.js";
import { updateProfile } from "./controllers/profile/updateProfile.js";
import { getAvatar } from "./controllers/profile/getAvatar.js";
import { getNews } from "./controllers/news/getNews.js";
import { createNew } from "./controllers/news/createNew.js";
import { getCategories } from "./controllers/categories/getCategories.js";
import { createCategory } from "./controllers/categories/createCategory.js";
import { getServices } from "./controllers/services/getServices.js";
import { getServiseById } from "./controllers/services/getServiseById.js";
import { createNewService } from "./controllers/services/createNewService.js";
import { getOrdersList } from "./controllers/orders/getOrdersList.js";
import { createOrder } from "./controllers/orders/createOrder.js";
import { changeOrderStatus } from "./controllers/orders/changeOrderStatus.js";
import { createBid } from "./controllers/createBid.js";

//порт на котором будет работать сервер
const PORT = 3000

//сама переменная сервера
const app = express()

//чтобы сервер понимал json
app.use(express.json())
app.use(cors())

app.post('/reg', register)
app.post('/auth', auth)
app.get('/profile', roleMiddleware(["USER", "ADMIN"]), profile)
app.put('/profile', roleMiddleware(["USER", "ADMIN"]), upload.single('avatar'), putAvatar);
app.patch('/profile', roleMiddleware(["USER", "ADMIN"]), updateProfile);
app.get('/avatars/:filename', getAvatar);
app.get('/news', getNews)
app.post('/news', roleMiddleware(["ADMIN"]), createNew)
app.get('/categories', getCategories);
app.post('/categories', createCategory);
app.get('/services', getServices);
app.get('/services/:id', getServiseById);
app.post('/services', roleMiddleware(['ADMIN']), upload.single('image'), createNewService);
app.get('/orders', roleMiddleware(["USER", "ADMIN"]), getOrdersList);
app.post('/orders', roleMiddleware(["ADMIN", "USER"]), createOrder);
app.patch('/orders', roleMiddleware(["ADMIN"]), changeOrderStatus);

app.post('/bid', createBid)


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