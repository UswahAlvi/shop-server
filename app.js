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
  origin: function (origin, callback) {
    const allowedOrigins = ['https://crochetingmyway.shop', 'http://localhost:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
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
