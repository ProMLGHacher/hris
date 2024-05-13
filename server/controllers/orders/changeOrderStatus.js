import { sql } from "../../db.js";

// изменение статуса заказа
export const changeOrderStatus = async (req, res) => {
    const { order_id, status } = req.body;
    try {
        await sql`UPDATE Orders SET status = ${status} WHERE id = ${order_id};`
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при создании заказа:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}