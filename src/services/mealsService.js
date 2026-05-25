import db from "../config/db.js"
import { appErr } from "../validation/appErr.js"

export const postMeal = async (meal, userId) => {
    try {
        const {
            meal_type,
            meal_name,
            calories,
            proteins,
            fats,
            carbs
        } = meal
    
        await db.promise().query(
            `INSERT INTO meals
            (user_id, meal_type, meal_name, calories, proteins, fats, carbs)
            VALUES(?, ?, ?, ?, ?, ?, ?)`,
            [userId, meal_type, meal_name, calories, proteins, fats, carbs]
        )
        
        return 'Прием пищи добавлен!'
    } catch (err) {
        throw new Error("Внутренняя ошибка сервера, повторите попытку позже.")
    }
}


export const getMeals = async (selectedDate, userId) => {
    try {
        const [result] = await db.promise().query(
            `SELECT * FROM meals
            WHERE user_id = ?
            AND DATE(created_at) = ?`,
            [userId, selectedDate]
        )

        if (result.length === 0) {
            throw new appErr("Данные за сегодняшний день не найдены!", 404)
        }

        return result
    } catch (err) {
        console.log(err)

        if (err instanceof appErr) {
            throw err
        }

        throw new Error('Внутренняя ошибка сервера, попробуйте позже.')
    }
}

export const getSummary = async (selectedDate, userId) => {
    try {
        const [result] = await db.promise().query(
            `SELECT
            SUM(calories) AS totalCalories,
            SUM(proteins) AS totalProteins,
            SUM(fats) AS totalFats,
            SUM(carbs) AS totalCarbs
            FROM meals
            WHERE user_id = ?
            AND DATE(created_at) = ?`,
            [userId, selectedDate]
        )

        return result
    } catch (err) {
        throw new Error('Внутренняя ошибка сервера, попробуйте позже.')
    }
}