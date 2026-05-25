import { weightHistoryData } from '../services/weightHistoryService.js'

export const weightHistoryControll = async (req, res) => {
    try {
        const result = await weightHistoryData(req.user.userId)

        return res.status(200).json(result)
    } catch (err) {
        if (err.name === "appErr") {
            return req.status(err.statusCode).json({
                message: err.message
            })
        }

        return res.status(500).json({
            message: "Внутренняя ошибка сервера."
        })
    }
}