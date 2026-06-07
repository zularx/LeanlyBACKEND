import { profileData, deleteProfile } from '../services/profileService.js'


export const profileControll = async (req, res) => {

    try {
        const result = await profileData(req.user)
    
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

export const deleteProfileControll = async (req, res) => {
    try {
        const result = await deleteProfile(req.user)

        return res.status(200).json({
            message: result
        })
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