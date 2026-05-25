import { postDailyStats, getDailyStats } from '../services/dailyStatsService.js'
import { dailyStatsSchema } from '../validation/dailyStatsValidation.js'

export const postDailyStatsControll = async (req, res) => {
    try {
        const userId = req.user.userId

        const validatedDailyStats = dailyStatsSchema.parse(req.body)
        await postDailyStats(validatedDailyStats, userId)

        return res.status(201).json({
            message: "Данные успешно добавлены!"
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

        return res.status(500).json({
            message: "Внутренняя ошибка сервера."
        })
    }
}

export const getDailyStatsControll = async (req, res) => {
    try {
        const selectedDate = req.params.date
        const userId = req.user.userId

        const result = await getDailyStats(selectedDate, userId)

        console.log(result)
        return res.status(200).json(
            result
        )

    } catch (err) {
        console.log(err)
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