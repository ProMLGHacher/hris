import { sql } from "../../db.js";

// получение списка всех услуг
export const getServices = async (req, res) => {
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
}