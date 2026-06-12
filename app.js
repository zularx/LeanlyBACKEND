import express from 'express';
import cors from 'cors';
import registerRoutes from './src/routes/registerRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import profileRoutes from './src/routes/profileRoutes.js'
import weightRoutes from './src/routes/weightRoutes.js'
import weightHistoryRoutes from './src/routes/weightHistoryRoutes.js'
import mealsRoutes from './src/routes/mealsRoutes.js'
import dailyStatsRoutes from './src/routes/dailyStatsRoutes.js'
import profileSettingsRoutes from './src/routes/profileSettingsRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'


const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const app = express()


const allowedOrigins = [
    'http://localhost:5173',
    'https://leanly-mu.vercel.app'
]

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/register', registerRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/weight', weightRoutes)
app.use('/api/weight-history', weightHistoryRoutes)
app.use('/api/meals', mealsRoutes)
app.use('/api/daily-stats', dailyStatsRoutes)
app.use('/api/profile-settings', profileSettingsRoutes)

app.use(express.static(path.join(__dirname, 'src', 'public')));


export default app