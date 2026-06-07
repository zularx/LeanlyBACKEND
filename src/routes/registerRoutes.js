import express from 'express'
import { registerCotroll } from '../controllers/registerController.js'

const router = express.Router()

router.post('/', registerCotroll)


export default router