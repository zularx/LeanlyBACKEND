import { register } from "../services/registerService.js"
import { registerSchema } from "../validation/registerValidation.js"


export const registerCotroll = async (req, res) => {
    try {
        const validated = registerSchema.parse(req.body)
        const result = await register(validated)

        return res.status(201).json({
            message: result
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