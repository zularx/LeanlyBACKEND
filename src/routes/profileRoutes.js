import express from 'express'
import { profileControll } from '../controllers/profileController.js' 
import { authMiddleware } from '../middleware/userMiddleware.js'

const router = express.Router()
router.get('/', authMiddleware ,profileControll)

export default router