import db from "../config/db.js"
import { appErr } from "../validation/appErr.js"

export const weightData = async ({ userId, weight }) => {
    try {
        const [result] = await db.promise().query(
            `UPDATE users SET userWeight = ? WHERE uid = ?`,
            [weight, userId]
        )

        if (result.affectedRows === 0) {
            throw new appErr("Пользователь не найден.", 404)
        }

        await db.promise().query(
            `INSERT INTO weight_history
            (user_id, weight)
            VALUES(?, ?)`,
            [userId, weight]
        )

        return {
            message: "Вес успешно обновлен!"
        }
    } catch (err) {
        if (err instanceof appErr) {
            throw err
        }

        throw new Error("Внутренняя ошибка базы данных, попробуйте позже.", 500)
    }
}