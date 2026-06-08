import db from "../config/db.js"
import { appErr } from "../validation/appErr.js";

export const profileSettingsData = async (userId) => {
    try {
        const result = await db.promise().query(
            `SELECT nickname, userHeight, goalWeight, userAge, activity, goal FROM users
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

export const profileSettingUpdate = async (data, userId) => {
    try {
        const {
            nickname,
            userHeight,
            goalWeight,
            userAge,
            activity,
            goal
        } = data

        const res = await db.promise().query(
            `UPDATE users
            SET
                nickname = ?,
                userHeight = ?,
                goalWeight = ?,
                userAge = ?,
                activity = ?,
                goal = ?
            WHERE uid = ?`,
            [nickname, userHeight, goalWeight, userAge, activity, goal, userId]
        )

        return 'Данные обновлены!'
    } catch(err) {
        console.log(err)
        throw new Error('Внутренняя ошибка сервера, попробуйте позже.')
    }

}