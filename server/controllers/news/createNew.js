import { sql } from "../../db.js"

// создать новую новсть
export const createNew = async (req, res) => {
    const temp = req.body
    if (!temp.title) return res.status(400).send({
        message: 'title is reqired'
    })
    if (!temp.description) return res.status(400).send({
        message: 'description is reqired'
    })
    if (!temp.href) return res.status(400).send({
        message: 'href is reqired'
    })
    if (!temp.category) return res.status(400).send({
        message: 'category is reqired'
    })
    await sql`insert into News(title, description, date, href, category) values(${temp.title}, ${temp.description}, ${Date.now()}, ${temp.href}, ${temp.category})`
    return res.send(200)
}