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

        if (err.code === 'ER_DUP_ENTRY') {
            if (err.message.includes('email')) {
                throw new appErr('Аккаунт с таким email уже существует!', 400, 'email')
            }
            if (err.message.includes('nickname')) {
                throw new appErr('Аккаунт с таким никнеймом уже существует!', 400, 'nickname')
            }
        }


        if (err instanceof appErr) {
            throw err
        }

        

        throw new Error("Внутренняя ошибка базы данных, попробуйте позже.")
    }
}