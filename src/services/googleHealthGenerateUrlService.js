import { google } from 'googleapis';


const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export const getGoogleAuthUrl = (userId) => {
    const scopes = ['https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email',
                    'https://www.googleapis.com/auth/fitness.activity.read',
                    'https://www.googleapis.com/auth/fitness.location.read'];

    const url = oauth2Client.generateAuthUrl({
        access_type: 'offline', 
        prompt: 'consent',    
        scope: scopes,
        state: String(userId)
    });

    return url
};