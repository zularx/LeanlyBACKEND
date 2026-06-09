import db from '../config/db.js'
import { appErr } from '../validation/appErr.js'


export const postDailyStats = async (data, userId) => {
    try {
        const {
            summary_date,
            steps,
            burned_calories,
            water_ml
        } = data

        await db.promise().query(
            `INSERT INTO daily_stats
            (user_id, summary_date, steps, burned_calories, water_ml)
            VALUES(?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                steps = VALUES(steps),
                burned_calories = VALUES(burned_calories),
                water_ml = VALUES(water_ml)`,
            [userId, summary_date, steps, burned_calories, water_ml]
        )
    
        return 'Данные успешно обновлены!'

    } catch (err) {
        console.log(err)
        throw err
    }
}

export const getDailyStats = async (selectedDate, userId) => {
    try {
        const [result] = await db.promise().query(
            `SELECT steps, burned_calories, water_ml FROM daily_stats
            WHERE summary_date = ?
            AND user_id = ?`,
            [selectedDate, userId]
        )

        if (result.length === 0) {
            throw new appErr("Данные за сегодняшний день не найдены!", 404)
        }

        return result[0]
    } catch (err) {
        console.log(err)

        if (err instanceof appErr) {
            throw err
        }
        
        throw new Error('Внутренняя ошибка сервера.')
    }
}

export const getDailyStatsHistory = async (userId) => {
    try {
        const [result] = await db.promise().query(
            `SELECT summary_date, steps FROM daily_stats
            WHERE user_id = ?`,
            [userId]
        )

        if (result.length === 0) {
            throw new appErr("Статистика шагов пользователя не найдена!", 404)
        }

        return result
    } catch (err) {
        console.log(err)

        if (err instanceof appErr) {
            throw err
        }

        throw new Error('Внутренняя ошибка сервера.')
    }
}