import db from "../config/db.js"
import { appErr } from "../validation/appErr.js"

import bcrypt from 'bcrypt'



export const register = async (data) => {
    const {
        nickname,
        email,
        password,
        userWeight,
        userHeight,
        userAge,
        gender,
        activity,
        goal,
        goalWeight
    } = data
    try {
        const [existingEmail] = await db.promise().query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        )
        const [existingNickname] = await db.promise().query(
            'SELECT * FROM users WHERE nickname = ?',
            [nickname]
        )

        if (existingEmail.length > 0) {
            throw new appErr('Аккаунт с таким email уже существует!', 400)
        }

        if (existingNickname.length > 0) {
            throw new appErr('Аккаунт с таким никнеймом уже существует!', 400)
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const [result] = await db.promise().query(
            `INSERT INTO users
        (nickname, email, password, userWeight, userHeight, userAge, gender, activity, goal, goalWeight)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nickname,
                email,
                hashedPassword,
                userWeight,
                userHeight,
                userAge,
                gender,
                activity,
                goal,
                goalWeight
            ]
        )
        
        await db.promise().query(
            `INSERT INTO weight_history
            (user_id, weight)
            VALUES(?, ?)`,
            [result.insertId, userWeight]
        )
        
        return "Пользователь создан успешно!"
    } catch (err) {
        console.log("ERROR:", err)

        if (err instanceof appErr) {
            throw err
        }

        

        throw new Error("Внутренняя ошибка базы данных, попробуйте позже.", 500)
    }
}