import { sendMessageToAdmins } from "../modules/telegram.js"

// оставление заявки от пользователя
export const createBid = async (req, res) => {
    const { name, email, message } = req.body
    if (!name) return res.status(400).send({
        message: 'name is reqired'
    })
    if (!email) return res.status(400).send({
        message: 'email is reqired'
    })
    if (!message) return res.status(400).send({
        message: 'message is reqired'
    })

    sendMessageToAdmins(`
        Новый запрос от ${name}! \nЕго email: ${email} \nСообщение от ${name}: ${message}`)

    res.send(200)
}