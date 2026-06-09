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
    const connection = await db.promise().getConnection()
    try {
        await connection.beginTransaction()
        const {
            nickname,
            userHeight,
            goalWeight,
            userAge,
            activity,
            goal
        } = data

        const [currentUsers] = await connection.query(
            `SELECT goal, userWeight FROM users WHERE uid = ?`,
            [userId]
        )

        if (currentUsers.length === 0) {
            throw new appErr('Пользователь не найден', 404)
        }

        const oldGoal = currentUsers[0].goal
        const currentWeight = currentUsers[0].userWeight

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
                goal = ?
            WHERE uid = ?`,
            [nickname, userHeight, goalWeight, userAge, activity, goal, userId]
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