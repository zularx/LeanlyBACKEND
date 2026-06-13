import express from 'express'
import { authMiddleware } from '../middleware/userMiddleware.js'
import { getGoogleAuthUrlControll } from '../controllers/googleHealthGenerateUrlController.js'
import { googleCallbackControll } from '../controllers/googleHealthConnectController.js'
import { getCurrentStepsControll } from '../controllers/googleStepsControll.js'

const router = express.Router()

router.get('/url', authMiddleware, getGoogleAuthUrlControll)
router.get('/callback', googleCallbackControll)
router.get('/steps', authMiddleware, getCurrentStepsControll)

export default router