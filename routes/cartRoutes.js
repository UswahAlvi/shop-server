import express from 'express';
import * as cartController from '../controllers/cartController.js';

const router = express.Router();


router.get('/', cartController.getCart);
router.post('/add', cartController.addItemToCart);
router.put('/update', cartController.updateItemQuantity);
router.post('/remove', cartController.removeItemFromCart);

export default router;
