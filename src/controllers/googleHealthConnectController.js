import { googleCallback } from "../services/googleHealthConnectService.js";

export const googleCallbackControll = async (req, res) => {
    try {
        const result = await googleCallback(req.query)
        
        res.redirect(result)
    } catch (err) {
        res.redirect('http://localhost:5173/settings/profile?sync=error')
    }
}