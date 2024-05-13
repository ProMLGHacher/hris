import jwt from "jsonwebtoken"
import { sendMessageToAdmins } from "../../modules/telegram.js";
import { sql } from "../../db.js";


// оформление заказа
export const createOrder = async (req, res) => {
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
}