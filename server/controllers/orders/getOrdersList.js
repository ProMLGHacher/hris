import { sql } from "../../db.js";

// получение списка истории заказов (пользователь только свои админ все)
export const getOrdersList = async (req, res) => {
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
}