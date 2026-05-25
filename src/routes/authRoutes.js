import express from 'express'
import { authControll } from '../controllers/authController.js'

const router = express.Router()
router.post('/', authControll)

export default router