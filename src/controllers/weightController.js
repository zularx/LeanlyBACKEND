import { weightData } from "../services/weightService.js"
import { weightSchema } from "../validation/weightValidation.js"

export const weightControll = async (req, res) => {
    try {
        const validatedWeight = weightSchema.parse({
            userId: req.user.userId,
            weight: req.body.weight
        })
        const result = await weightData(validatedWeight)
        return res.status(200).json({
            result
        })
    } catch(err) {
        if (err.name === 'ZodError') {
            return res.status(422).json({
                issues: err.issues.map(e => ({
                    field: e.path[0],
                    message: e.message
                }))
            })
        }

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