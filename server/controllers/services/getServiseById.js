import { sql } from "../../db.js";

// получение усоуги по id
export const getServiseById = async (req, res) => {
    const service_id = req.params.id
    try {
        const services = await sql`SELECT * FROM Services where id = ${service_id}`;
        res.json(services[0]);
    } catch (error) {
        console.error('Ошибка при получении услуг:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}