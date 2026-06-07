import express from 'express'
import { deleteProfileControll, profileControll } from '../controllers/profileController.js' 
import { authMiddleware } from '../middleware/userMiddleware.js'

const router = express.Router()
router.get('/', authMiddleware ,profileControll)
router.delete('/', authMiddleware, deleteProfileControll)

export default router