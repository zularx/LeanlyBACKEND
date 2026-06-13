import { profileSettingsData, profileSettingUpdate } from '../services/profileSettingsService.js'
import { appErr } from '../validation/appErr.js'
import { profileUpdateSchema } from '../validation/profileUpdateValidation.js'

export const profileSettingsGetControll = async (req, res) => {
    try {
        const result = await profileSettingsData(req.user.userId)


        return res.status(200).json({
            result: result
        })
    } catch (err) {
        if (err instanceof appErr) {
            return res.status(err.statusCode).json({
                message: err.message
            })
        }
        return res.status(500).json({
            message: 'Внутренняя ошибка сервера, попробуйте позже.'
        })
    }
}

export const profileSettingsPostControll = async (req, res) => {
    try {
        const validatedProfileUpdate = profileUpdateSchema.parse(req.body)
        const result = await profileSettingUpdate(validatedProfileUpdate, req.user.userId, req.file)

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
        return res.status(500).json({
            message: err.message
        })
    }
}