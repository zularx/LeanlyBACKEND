import express from 'express'
import { weightHistoryControll } from '../controllers/weightHistoryController.js'
import { authMiddleware } from '../middleware/userMiddleware.js'

const router = express.Router()
router.get('/', authMiddleware, weightHistoryControll)

export default router