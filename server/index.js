import express, { response } from "express";
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
import swaggerUi from 'swagger-ui-express';

//порт на котором будет работать сервер
const PORT = 3000

//сама переменная сервера
const app = express()

//чтобы сервер понимал json
app.use(express.json())
app.use(cors())

const swaggerDocument = {
    openapi: '3.0.0',
    info: {
        title: 'Express API for Dangle',
        version: '1.0.0',
        description: 'The REST API for Dangle Panel service'
    },
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server'
        }
    ],
    paths: {
        '/reg': {
            post: {
                summary: 'Регистрация нового пользователя',
                description: 'Регистрация нового пользователя',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    password: { type: 'string' },
                                    isAdmin: { type: 'boolean' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '409': {
                        description: 'Пользователь уже сущетсвует'
                    },
                    '200': {
                        description: 'Пользователь успешно зарегистрирован'
                    },
                }
            }
        },
        '/auth': {
            post: {
                summary: 'Авторизация пользователя',
                description: 'Авторизация пользователя',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    username: { type: 'string' },
                                    password: { type: 'string' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '400': {
                        description: 'Неверные данные'
                    },
                    '401': {
                        description: 'Пользователь не авторизован'
                    },
                    '200': {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        token: { type: 'string' },
                                        user: {
                                            type: 'object',
                                            properties: {
                                                id: { type: 'integer', allowNull: false },
                                                login: { type: 'string', maxLength: 100, allowNull: false },
                                                name: { type: 'string', maxLength: 100 },
                                                lastname: { type: 'string', maxLength: 100 },
                                                email: { type: 'string', maxLength: 100 },
                                                role: { type: 'string', maxLength: 100, references: { model: 'Roles', key: 'role' } },
                                                avatar: { type: 'string', maxLength: 250 },
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/profile': {
            put: {
                summary: 'Обновление аватарки пользователя',
                description: 'Обновление аватарки пользователя',
                security: [{ bearer: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'multipart/form-data': {
                            schema: {
                                type: 'object',
                                properties: {
                                    avatar: { type: 'string', format: 'binary' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Аватарка пользователя успешно обновлена'
                    },
                    '400': {
                        description: 'Неверные данные'
                    }
                }
            },
            patch: {
                summary: 'Обновление профиля пользователя',
                description: 'Обновление профиля пользователя',
                security: [{ bearer: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', maxLength: 100 },
                                    lastname: { type: 'string', maxLength: 100 },
                                    email: { type: 'string', maxLength: 100 },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Профиль пользователя успешно обновлен'
                    },
                    '400': {
                        description: 'Неверные данные'
                    }
                }
            },
            get: {
                summary: 'Получение профиля пользователя',
                description: 'Получение профиля пользователя',
                security: [{ bearer: [] }],
                responses: {
                    '200': {
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer', allowNull: false },
                                        login: { type: 'string', maxLength: 100, allowNull: false },
                                        name: { type: 'string', maxLength: 100 },
                                        lastname: { type: 'string', maxLength: 100 },
                                        email: { type: 'string', maxLength: 100 },
                                        role: { type: 'string', maxLength: 100, references: { model: 'Roles', key: 'role' } },
                                        avatar: { type: 'string', maxLength: 250 },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/avatars/:filename': {
            get: {
                summary: 'Получение аватарки пользователя',
                description: 'Получение аватарки пользователя',
                security: [{ bearer: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'filename',
                        required: true,
                        schema: {
                            type: 'string'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Аватар успешно получен',
                        content: {
                            'image/png': {
                                schema: {
                                    type: 'string',
                                    format: 'binary'
                                }
                            }
                        }
                    }
                }
            }
        },
        '/news': {
            get: {
                summary: 'Получение новостей',
                description: 'Получение новостей',
                security: [{ bearer: [] }],
                responses: {
                    '200': {
                        description: 'Новости успешно получены',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', allowNull: false },
                                            user_id: { type: 'integer', allowNull: false },
                                            title: { type: 'string', maxLength: 100, allowNull: false },
                                            description: { type: 'string', allowNull: false },
                                            date: { type: 'string', format: 'date', allowNull: false },
                                            href: { type: 'string', maxLength: 200, allowNull: false },
                                            category: { type: 'string', maxLength: 50, allowNull: false },
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: 'Создание новой новости',
                description: 'Создание новой новости',
                security: [{ bearer: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string', maxLength: 100, allowNull: false },
                                    description: { type: 'string', allowNull: false },
                                    href: { type: 'string', maxLength: 200, allowNull: false },
                                    category: { type: 'string', maxLength: 50, allowNull: false },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Новость успешно создана'
                    },
                    '400': {
                        description: 'Неверные данные'
                    }
                }
            }
        },
        '/categories': {
            get: {
                summary: 'Получение категорий',
                description: 'Получение категорий',
                security: [{ bearer: [] }],
                responses: {
                    '200': {
                        description: 'Категории успешно получены',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', allowNull: false },
                                            name: { type: 'string', maxLength: 100, allowNull: false },
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: 'Создание новой категории',
                description: 'Создание новой категории',
                security: [{ bearer: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    name: { type: 'string', maxLength: 100, allowNull: false },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Категория успешно создана'
                    },
                    '400': {
                        description: 'Неверные данные'
                    }
                }
            }
        },
        '/services': {
            get: {
                summary: 'Получение услуг',
                description: 'Получение услуг',
                security: [{ bearer: [] }],
                parameters: [
                    {
                        in: 'query',
                        name: 'category_id', 
                        schema: {
                            type: 'integer'
                        },
                        required: true,
                        description: 'Id для фильтрации сервисов по категории'
                    }
                ],
                responses: {
                    '200': {
                        description: 'Сервисы успешно получены',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', allowNull: false },
                                            title: { type: 'string', maxLength: 100, allowNull: false },
                                            description: { type: 'string', allowNull: false },
                                            category_id: { type: 'integer', allowNull: false },
                                            price: { type: 'integer', allowNull: false },
                                            image: { type: 'string', maxLength: 100, allowNull: false },
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: 'Создание новой услуги',
                description: 'Создание новой услуги',
                security: [{ bearer: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    title: { type: 'string', maxLength: 100, allowNull: false },
                                    description: { type: 'string', allowNull: false },
                                    category_id: { type: 'integer', allowNull: false },
                                    price: { type: 'integer', allowNull: false },
                                    avatar: {
                                        type: 'string',
                                        format: 'binary'
                                    }
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Услуга успешно создана'
                    },
                    '400': {
                        description: 'Неверные данные'
                    }
                }
            }
        },
        '/services/:id': {
            get: {
                summary: 'Получение услуги по id',
                description: 'Получение услуги по id',
                security: [{ bearer: [] }],
                parameters: [
                    {
                        in: 'path',
                        name: 'id',
                        required: true,
                        schema: {
                            type: 'integer'
                        }
                    }
                ],
                responses: {
                    '200': {
                        description: 'Услуга успешно получена',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        id: { type: 'integer', allowNull: false },
                                        title: { type: 'string', maxLength: 100, allowNull: false },
                                        description: { type: 'string', allowNull: false },
                                        category_id: { type: 'integer', allowNull: false },
                                        price: { type: 'integer', allowNull: false },
                                        image: { type: 'string', maxLength: 100, allowNull: false },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        '/orders': {
            get: {
                summary: 'Получение заказов',
                description: 'Получение заказов',
                security: [{ bearer: [] }],
                responses: {
                    '200': {
                        description: 'Заказы успешно получены',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'array',
                                    items: {
                                        type: 'object',
                                        properties: {
                                            id: { type: 'integer', allowNull: false },
                                            user: { 
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer', allowNull: false },
                                                    login: { type: 'string', maxLength: 100, allowNull: false },
                                                    name: { type: 'string', maxLength: 100, allowNull: false },
                                                    lastname: { type: 'string', maxLength: 100, allowNull: false },
                                                    email: { type: 'string', maxLength: 100, allowNull: false },
                                                    role: { type: 'string', maxLength: 100, allowNull: false },
                                                    avatar: { type: 'string', maxLength: 100, allowNull: false },
                                                }
                                             },
                                            service: { 
                                                type: 'object',
                                                properties: {
                                                    id: { type: 'integer', allowNull: false },
                                                    title: { type: 'string', maxLength: 100, allowNull: false },
                                                    category_id: { type: 'integer', allowNull: false },
                                                    price: { type: 'integer', allowNull: false },
                                                    image: { type: 'string', maxLength: 100, allowNull: false },
                                                }
                                            },
                                            order_date: { type: 'string', format: 'date', allowNull: false },
                                            status: { type: 'string', maxLength: 100, allowNull: false },
                                            adress: { type: 'string', maxLength: 100, allowNull: false },
                                            email: { type: 'string', maxLength: 100, allowNull: false },
                                            lastname: { type: 'string', maxLength: 100, allowNull: false },
                                            message: { type: 'string', maxLength: 100, allowNull: false },
                                            name: { type: 'string', maxLength: 100, allowNull: false },
                                            phone: { type: 'string', maxLength: 100, allowNull: false },
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            post: {
                summary: 'Создание нового заказа',
                description: 'Создание нового заказа',
                security: [{ bearer: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    service_id: { type: 'integer', allowNull: false },
                                    adress: { type: 'string', maxLength: 100, allowNull: false },
                                    email: { type: 'string', maxLength: 100, allowNull: false },
                                    lastname: { type: 'string', maxLength: 100, allowNull: false },
                                    message: { type: 'string', maxLength: 100, allowNull: false },
                                    name: { type: 'string', maxLength: 100, allowNull: false },
                                    phone: { type: 'string', maxLength: 100, allowNull: false },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Заказ успешно создан'
                    },
                    '400': {
                        description: 'Неверные данные'
                    }
                }
            },
            patch: {
                summary: 'Изменение статуса заказа',
                description: 'Изменение статуса заказа',
                security: [{ bearer: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: { type: 'integer', allowNull: false },
                                    status: { type: 'string', maxLength: 100, allowNull: false },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '200': {
                        description: 'Заказ успешно изменен'
                    },
                    '400': {
                        description: 'Неверные данные'
                    }
                }
            }
        },
        '/bid': {
            post: {
                summary: 'Создание новой заявки',
                description: 'Создание новой заявки',
                security: [{ bearer: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    email: { type: 'string', maxLength: 100, allowNull: false },
                                    name: { type: 'string', maxLength: 100, allowNull: false },
                                    message: { type: 'string', maxLength: 100, allowNull: false },
                                }
                            }
                        }
                    }
                },
                responses: {
                    '201': {
                        description: 'Заявка успешно создана'
                    },
                    '400': {
                        description: 'Неверные данные'
                    }
                }
            }
        },
    },
}

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
        user_id INT,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        date DATE NOT NULL,
        href varchar(200) NOT NULL,
        category varchar(50) NOT NULL,
        FOREIGN KEY (user_id) REFERENCES Users(id)
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