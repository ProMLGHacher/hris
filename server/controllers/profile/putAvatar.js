import jwt from "jsonwebtoken"
import { sql } from "../../db.js";

// загрузить аватарку пользователя
export const putAvatar = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { id: userId } = jwt.verify(token, "SECRET_KEY")
    const avatar = req.file ? req.file.filename : null;

    try {
        await sql`
            UPDATE Users
            SET avatar = ${avatar}
            WHERE id = ${userId}
        `;

        res.status(200).send('User updated successfully');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal server error');
    }
}