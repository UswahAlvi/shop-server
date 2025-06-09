import express from 'express'
import * as favoriteController from '../controllers/favoriteController.js';


const router = express.Router();


router.get('/', favoriteController.getFavorites);
router.post('/toggle', favoriteController.toggleFavoriteItem)

export default router;
