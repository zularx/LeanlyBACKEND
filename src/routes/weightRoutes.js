import express from 'express'
import { weightControll } from '../controllers/weightController.js'
import { authMiddleware } from '../middleware/userMiddleware.js'

const router = express.Router()
router.post('/', authMiddleware, weightControll)

export default router