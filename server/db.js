import postgres from 'postgres'

//подключение к базе данных
export const sql = postgres({
    host: 'localhost',
    port: 5432,
    db: 'hris',
    username: 'postgres',
    password: '123'
})