import db from "../config/db.js";
import { appErr } from "../validation/appErr.js";
import fs from 'fs/promises'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const profileData = async (data) => {
    try {
        const userId = data.userId 
        console.log("USER ID:", userId)
        const [pData] = await db.promise().query(
            `SELECT uid, nickname, email, userWeight, userHeight, userAge, gender, activity, goal, goalWeight, userStartWeight, user_avatar, avg_steps FROM users WHERE uid = ?`,
            [userId]
        )

        if (pData.length === 0) {
            throw new appErr('Данные пользователя не найдены.', 404)
        }

        if (pData[0].user_avatar === null || pData[0].user_avatar === '') {
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
        const [user] = await db.promise().query(
            `SELECT user_avatar FROM users
            WHERE uid = ?`,
            [userId]
        )

        if (user.length === 0) {
            throw new appErr('Пользователь не найден', 404)
        }

        const avatarFilename = user[0].user_avatar

        const [response] = await db.promise().query(
            `DELETE FROM users
            WHERE uid = ?`,
            [userId]
        )

        if (avatarFilename) {
            const filePath = path.join(__dirname, '../public/uploads/avatars', avatarFilename)
            
            try {
                await fs.unlink(filePath)
                console.log(`Файл ${avatarFilename} успешно удален с сервера.`)
            } catch (fileErr) {
                console.error(`Файл не найден на диске, но запись из БД удалена: ${filePath}`)
            }
        }

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