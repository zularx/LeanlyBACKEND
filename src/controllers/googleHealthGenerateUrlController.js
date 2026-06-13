import { getGoogleAuthUrl } from "../services/googleHealthGenerateUrlService.js";

export const getGoogleAuthUrlControll = async (req, res) => {
    try {
        const url = getGoogleAuthUrl(req.user.userId)
    
        return res.status(200).json({
            url
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Внутренняя ошибка повторите позже'
        })
    }
}