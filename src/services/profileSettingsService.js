import db from "../config/db.js"
import { appErr } from "../validation/appErr.js";
import path from 'path'
import sharp from "sharp"
import { fileURLToPath } from 'url'
import fs from 'fs/promises'



const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



export const profileSettingsData = async (userId) => {
    try {
        const result = await db.promise().query(
            `SELECT nickname, userHeight, goalWeight, userAge, activity, goal, avg_steps FROM users
            WHERE uid = ?`,
            [userId]
        )

        if (result[0].length === 0) {
            throw new appErr('Пользователь не найден', 404)
        }

        return result[0];
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const profileSettingUpdate = async (data, userId, user_avatar) => {
    const connection = await db.promise().getConnection()
    let avatarFileName = 'default_avatar.webp'
    try {
        await connection.beginTransaction()
        const {
            nickname,
            userHeight,
            goalWeight,
            userAge,
            activity,
            goal,
            avgSteps
        } = data

        console.log(data)

        const [currentUsers] = await connection.query(
            `SELECT goal, userWeight, user_avatar FROM users WHERE uid = ?`,
            [userId]
        )

        if (currentUsers.length === 0) {
            throw new appErr('Пользователь не найден', 404)
        }

        const oldGoal = currentUsers[0].goal
        const currentWeight = currentUsers[0].userWeight
        const oldUserAvatar = currentUsers[0].user_avatar

        if (user_avatar && oldUserAvatar) {
            const filePath = path.join(__dirname, '../public/uploads/avatars', oldUserAvatar)
            
            try {
                await fs.unlink(filePath)
                console.log(`Файл ${oldUserAvatar} успешно удален с сервера.`)
            } catch (fileErr) {
                console.error(`Файл не найден на диске, но запись из БД удалена: ${oldUserAvatar}`)
            } finally {
                avatarFileName = `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`
                const uploadPath = path.join(__dirname, '../public/uploads/avatars', avatarFileName)

                await connection.query(
                    `UPDATE users
                    SET
                        user_avatar = ?
                    WHERE uid = ?`,
                    [avatarFileName, userId]
                )
                    
                await sharp(user_avatar.buffer)
                    .resize(400, 400, {fit: 'cover' })
                    .webp({ quality: 80 })
                    .toFile(uploadPath)
            }
        }

        if (oldGoal !== goal) {
            await connection.query(
                `UPDATE users
                SET 
                    userStartWeight = ?
                WHERE uid = ?`,
                [currentWeight, userId]
            )
        }

        await connection.query(
            `UPDATE users
            SET
                nickname = ?,
                userHeight = ?,
                goalWeight = ?,
                userAge = ?,
                activity = ?,
                goal = ?,
                avg_steps = ?
            WHERE uid = ?`,
            [nickname, userHeight, goalWeight, userAge, activity, goal, avgSteps, userId]
        )

        await connection.commit()

        return 'Данные обновлены!'
    } catch(err) {
        await connection.rollback()
        console.log(err)
        throw new Error('Внутренняя ошибка сервера, попробуйте позже.')
    } finally {
        connection.release()
    }

}