import express from 'express'
import { authMiddleware } from '../middleware/userMiddleware.js'
import { profileSettingsGetControll, profileSettingsPostControll } from '../controllers/profileSettingsGetController.js'
import multer from 'multer';

const upload = multer()

const router = express.Router()

router.get('/', authMiddleware, profileSettingsGetControll)
router.put('/', authMiddleware, upload.single('user_avatar'), profileSettingsPostControll)


export default router