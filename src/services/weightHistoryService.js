import db from "../config/db.js"
import { appErr } from "../validation/appErr.js"

export const weightHistoryData = async (data) => {
    try {
        const [weight] = await db.promise().query(
            `SELECT weight, created_at
            FROM weight_history
            WHERE user_id = ?
            ORDER BY created_at ASC`,
            [data]
        )

        if (weight.length === 0) {
            throw new appErr("История веса не найдена!", 404)
        }
    
        return weight

    } catch (err) {
        console.log(err)

        if (err instanceof appErr) {
            throw err
        }

        throw new Error("Внутренняя ошибка сервера, попробуйте еще раз.", 500)
    }
}