import { sql } from "../../db.js";


// получить список всех категорий
export const getCategories = async (req, res) => {
    try {
        const categories = await sql`SELECT * FROM Categories`;
        res.json(categories);
    } catch (error) {
        console.error('Ошибка при получении категорий услуг:', error);
        res.status(500).json({ error: 'Внутренняя ошибка сервера' });
    }
}