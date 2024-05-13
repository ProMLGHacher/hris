import { sql } from "../../db.js"

// получить все новости
export const getNews = async (req, res) => {
    const news = await sql`select * from News`
    return res.send(news)
}