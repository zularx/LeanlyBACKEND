import db from "../config/db.js"
import { appErr } from "../validation/appErr.js"
import path from 'path'
import sharp from "sharp"
import { fileURLToPath } from 'url'
import bcrypt from 'bcrypt'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)



export const register = async (data, avatarFile) => {
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
        goalWeight,
        avg_steps
    } = data

    let avatarFilename = ' '

    try {
        if (avatarFile) {
            avatarFilename = `avatar-${Date.now()}-${Math.round(Math.random() * 1E9)}.webp`
    
            const uploadPath = path.join(__dirname, '../public/uploads/avatars', avatarFilename)
    
            await sharp(avatarFile.buffer)
                .resize(400, 400, {fit: 'cover' })
                .webp({ quality: 80 })
                .toFile(uploadPath)
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const [result] = await db.promise().query(
            `INSERT INTO users
        (nickname, email, password, userWeight, userHeight, userAge, gender, activity, goal, goalWeight, userStartWeight, user_avatar, avg_steps)
        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                goalWeight,
                userWeight,
                avatarFilename,
                avg_steps
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