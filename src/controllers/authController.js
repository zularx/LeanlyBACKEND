import { authUser } from '../services/authService.js'
import { authSchema } from '../validation/authValidation.js'

export const authControll = async (req, res) => {
    try {
        const authValided = authSchema.parse(req.body)

        const token = await authUser(authValided)

        return res.status(200).json({
            token
        }) 
    } catch (err){
        if (err.name === 'ZodError') {
            return res.status(400).json({
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