import { mealSchema } from "../validation/mealValidation.js"
import { postMeal, getMeals, getSummary } from "../services/mealsService.js"

export const mealPostControll = async (req, res) => {
    try {
        const validatedMeal = mealSchema.parse(req.body)
        const result = await postMeal(validatedMeal, req.user.userId, req.params.date)

        return res.status(201).json({
            message: result
        })
    } catch (err) {
        if (err.name === 'ZodError') {
            return res.status(422).json({
                issues: err.issues.map(e => ({
                    field: e.path[0],
                    message: e.message
                }))
            })
        }

        if (err.name === "appErr") {
            return res.status(err.statusCode).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: "Внутренняя ошибка сервера."
        })
    }
}

export const getMealsControll = async (req, res) => {
    try {
        const result = await getMeals(req.params.date, req.user.userId)

        return res.status(200).json(result)
    } catch (err) {
        if (err.name === 'appErr') {
            return res.status(err.statusCode).json({
                message: err.message
            })
        }
        return res.status(500).json({
            message: "Внутренняя ошибка сервера."
        })
    }
}

export const getSummaryControll = async (req, res) => {
    try {
        const result = await getSummary(req.params.date, req.user.userId)

        return res.status(200).json(result)
    } catch (err) {
        if (err.name === 'appErr') {
            return res.status(err.statusCode).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: "Внутренняя ошибка сервераа."
        })
    }
}