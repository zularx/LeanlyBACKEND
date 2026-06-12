import db from "../config/db.js";
import { appErr } from "../validation/appErr.js";

export const profileData = async (data) => {
    try {
        const userId = data.userId 
        console.log("USER ID:", userId)
        const [pData] = await db.promise().query(
            `SELECT uid, nickname, email, userWeight, userHeight, userAge, gender, activity, goal, goalWeight, userStartWeight, user_avatar FROM users WHERE uid = ?`,
            [userId]
        )

        if (pData.length === 0) {
            throw new appErr('Данные пользователя не найдены.', 404)
        }

        if (pData[0].user_avatar === '') {
            pData[0].user_avatar = 'default_avatar.webp'
        }

        return pData[0]
    } catch (err) {
        console.log("ERROR:", err)

        if (err instanceof appErr) {
            throw err
        }

        throw new Error("Внутренняя ошибка сервера, попробуйте позже.", 500)
    }
}

export const deleteProfile = async (data) => {
    try {
        const userId = data.userId
        const [response] = await db.promise().query(
            `DELETE FROM users
            WHERE uid = ?`,
            [userId]
        )

        if (response.affectedRows === 0) {
            throw new appErr('Похоже такого пользователя не существует', 404)
        }

        return 'Пользователь успешно удален'
    } catch (err) {
        if (err instanceof appErr) {
            throw err
        }

        throw new Error("Внутренняя ошибка сервера, попробуйте позже.", 500)
    }
}