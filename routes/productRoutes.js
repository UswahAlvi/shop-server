import express from 'express';
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts)
router.get('/category/:category', getProductsByCategory);
router.get('/search', searchProducts); 

export default router;
