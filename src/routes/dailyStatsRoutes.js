import express from 'express'
import { authMiddleware } from '../middleware/userMiddleware.js'
import { getDailyStatsControll, postDailyStatsControll} from '../controllers/dailyStatsController.js'


const router = express.Router()

router.get('/:date', authMiddleware, getDailyStatsControll)
router.post('/', authMiddleware, postDailyStatsControll)


export default router