import { sql } from "../../db.js";

// создать категорию
export const createCategory = async (req, res) => {
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
}