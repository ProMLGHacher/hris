import { sql } from "../db.js";
import bcrypt from 'bcryptjs'

//контроллер регистрации
export const register = async (req, res) => {
    //вытаскиваем json и сразу вытаскиваем из нее переменные
    const {username, password, isAdmin} = req.body;
    
    //кандидат это переменная в которую попытаемся найти и записать пользователя с таким никнеймом
    let candidate = (await sql`select * from Users where login = ${username}`)[0]
    //если мы нашли пользователя с таким ником, то отправляем пользователю обратно ошибку что пользователь уже существует
    if (candidate) {
        return res.send({
            message: "Пользователь уже сущетсвует"
        })
    }
    //хешируем пароль
    console.log(req.body);
    const hashPassword = bcrypt.hashSync(password, 7)
    //вытаскиваем из базы роль для пользователя так как у нас связка таблиц
    const userRole = await sql`select * from Roles where role = ${isAdmin ? 'ADMIN' : 'USER'}`
    //создаем нового пользователя
    await sql`insert into Users(login, role, password) values(${username}, ${userRole[0].role}, ${hashPassword})`
    //отправляем пользователю 200 статус код (это значит что всё успешно)
    return res.send({message: "Пользователь успешно зарегистрирован"})
}