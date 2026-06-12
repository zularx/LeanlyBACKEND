import express from 'express'
import { registerCotroll } from '../controllers/registerController.js'
import multer from 'multer';

const upload = multer()
const router = express.Router()

router.post('/', upload.single('avatar'), registerCotroll)


export default router