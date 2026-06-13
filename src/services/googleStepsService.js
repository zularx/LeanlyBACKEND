import db from "../config/db.js";
import { google } from 'googleapis';

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

export const getCurrentSteps = async (userId, steps_date) => {
    try {
        // 1. Достаем refresh_token пользователя из базы
        const [users] = await db.promise().query(
            'SELECT google_refresh_token FROM users WHERE uid = ?',
            [userId]
        );

        const user = users[0];
        if (!user || !user.google_refresh_token) {
            console.log(`[Google Service] У пользователя ${userId} отсутствует refresh_token`);
            return { success: true, steps: 0, source: 'no_connection' };
        }

        // 2. Устанавливаем токен в клиент
        oauth2Client.setCredentials({ refresh_token: user.google_refresh_token });
        
        // --- ИСПРАВЛЕНИЕ: Мы полностью убрали getAccessToken() ---
        // oauth2Client.request сам разберется с генерацией access_token под капотом

        // 3. Формируем таймстампы в миллисекундах
        const targetDate = steps_date ? new Date(steps_date) : new Date();

g

        // 4. Прямой HTTP POST-запрос к фитнес-агрегатору
        const response = await oauth2Client.request({
            url: 'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
            method: 'POST',
            data: {
                aggregateBy: [
                    {
                        dataTypeName: 'com.google.step_count.delta',
                    }
                ],
                startTimeMillis: startTime.getTime(),
                endTimeMillis: endTime.getTime(),
                bucketByTime: { durationMillis: 86400000 }
            }
        });

        // 5. Парсим результат
        let googleSteps = 0;
        
        if (response.data && response.data.bucket && response.data.bucket[0]) {
            const dataset = response.data.bucket[0].dataset[0];
            if (dataset && dataset.point && dataset.point[0]) {
                googleSteps = dataset.point[0].value[0].intVal || 0;
            }
        }

        return { 
            success: true, 
            steps: googleSteps, 
            source: 'google_live' 
        };

    } catch (error) {
        if (error.response && error.response.data) {
            console.error('Детали ошибки от Google API:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('Ошибка в getCurrentSteps service:', error);
        }
        throw error;
    }
};