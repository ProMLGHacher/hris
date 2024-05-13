import { sql } from "../../db.js";

// создание новой услуги
export const createNewService = async (req, res) => {
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
}