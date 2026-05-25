import db from "../config/db.js";

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { appErr } from "../validation/appErr.js";



export const authUser = async (data) => {
    try {
        const {
            email,
            password
        } = data
    
        const [user] = await db.promise().query(
            `SELECT * FROM users WHERE email = ?`,
            [email]
        )
    
        if (user.length === 0) {
            throw new appErr("Пользователь не найден!", 404)
        }
    
        const pasHash = user[0].password
        const isMatch = await bcrypt.compare(password, pasHash)
    
        if (!isMatch) {
            throw new appErr("Неправильный пароль!", 401)
        }

        const token = jwt.sign(
            {
                userId: user[0].uid
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )
        return token
    } catch (err) {
        console.log("ERROR:", err)
        if (err instanceof appErr) {
            throw err
        }

        throw new Error("Внутренняя ошибка сервера, попробуйте позже.", 500)
    }
}