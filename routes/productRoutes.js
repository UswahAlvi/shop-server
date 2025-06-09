import express from 'express';
import {
  getAllProducts,
  getProductsByCategory,
  searchProducts,
  getProductById, 
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/search', searchProducts);
router.get('/:id', getProductById); 

export default router;
