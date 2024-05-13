import jwt from "jsonwebtoken";
import { sql } from "../../db.js";

//обновить данные профиля пользователя
export const updateProfile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { id: userId } = jwt.verify(token, "SECRET_KEY")
    const { name, lastname, email } = req.body

    try {
        if (name) {
            await sql`
                UPDATE Users
                SET name = ${name}
                WHERE id = ${userId}
            `;
        }
        if (lastname) {
            await sql`
                UPDATE Users
                SET lastname = ${lastname}
                WHERE id = ${userId}
            `;
        }
        if (email) {
            await sql`
                UPDATE Users
                SET email = ${email}
                WHERE id = ${userId}
            `;
        }

        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
}