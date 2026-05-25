import express from 'express';
import cors from 'cors';
import registerRoutes from './src/routes/registerRoutes.js'
import authRoutes from './src/routes/authRoutes.js'
import profileRoutes from './src/routes/profileRoutes.js'
import weightRoutes from './src/routes/weightRoutes.js'
import weightHistoryRoutes from './src/routes/weightHistoryRoutes.js'
import mealsRoutes from './src/routes/mealsRoutes.js'
import dailyStatsRoutes from './src/routes/dailyStatsRoutes.js'


const app = express()


app.use(cors())
app.use(express.json())

app.use('/api/register', registerRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/weight', weightRoutes)
app.use('/api/weight-history', weightHistoryRoutes)
app.use('/api/meals', mealsRoutes)
app.use('/api/daily-stats', dailyStatsRoutes)

export default app