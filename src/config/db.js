import mysql from 'mysql2'

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.APP_USER_PASSWORD,
    database: process.env.DB_NAME,
})

export default db