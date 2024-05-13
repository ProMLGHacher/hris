import jwt from "jsonwebtoken"
import { sql } from "../../db.js"

// полученгие данных прользователя
export const profile = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]
    const { id: user_id } = jwt.verify(token, "SECRET_KEY")
    const user = (await sql`select * from Users where id = ${user_id}`)[0]
    return res.send(user)
}