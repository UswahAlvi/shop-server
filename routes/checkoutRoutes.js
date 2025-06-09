import express from 'express'
import { handleCheckout } from '../controllers/checkoutController.js'
const router = express.Router()

router.post('/',handleCheckout)
export default router