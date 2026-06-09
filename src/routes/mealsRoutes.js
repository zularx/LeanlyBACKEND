import express from 'express'
import { mealPostControll, getMealsControll, getSummaryControll } from '../controllers/mealsController.js'
import { authMiddleware } from '../middleware/userMiddleware.js'

const router = express.Router()


router.post('/:date', authMiddleware, mealPostControll)
router.get('/:date', authMiddleware, getMealsControll)
router.get('/:date/summary', authMiddleware, getSummaryControll)

export default router