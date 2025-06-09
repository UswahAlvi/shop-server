import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import favoriteRoutes from './routes/favoriteRouter.js';
import { ensureSession } from './middlewares/session.js';
import couponRoutes from './routes/couponRoutes.js'
import checkoutRoutes from './routes/checkoutRoutes.js'
const app = express();

app.use(cors({
  origin: 'https://crochetingmyway.shop',
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(ensureSession);

app.use('/products', productRoutes)
app.use('/cart', cartRoutes); 
app.use('/favorites',favoriteRoutes)
app.use('/coupons',couponRoutes)
app.use('/checkout', checkoutRoutes)

export default app;
