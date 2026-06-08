import express from 'express'
import { authMiddleware } from '../middleware/userMiddleware.js'
import { profileSettingsGetControll, profileSettingsPostControll } from '../controllers/profileSettingsGetController.js'

const router = express.Router()

router.get('/', authMiddleware, profileSettingsGetControll)
router.put('/', authMiddleware, profileSettingsPostControll)


export default router