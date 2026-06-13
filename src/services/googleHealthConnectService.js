import db from '../config/db.js'
import { google } from 'googleapis';
import { appErr } from '../validation/appErr.js'

export const googleCallback = async (query) => {
    const {code, state} = query
    const userId = state;

    if (!code) {
        throw new appErr('Код не предоставлен.', 400)
    }

    try {
        const oauth2Client = new google.auth.OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            process.env.GOOGLE_REDIRECT_URI
        );


        const { tokens } = await oauth2Client.getToken(code);
        const refreshToken = tokens.refresh_token;


        if (refreshToken) {
            await db.promise().query(
                'UPDATE users SET google_refresh_token = ? WHERE uid = ?',
                [refreshToken, userId]
            );
        }

        return 'http://localhost:5173/settings/profile?sync=success';
    } catch (error) {
        const err = `Ошибка при обработке callback Google: ${error}`
        throw new Error(err);
    }
} 