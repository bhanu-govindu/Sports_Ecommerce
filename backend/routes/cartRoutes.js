import express from 'express';
import { getCartForCustomer, addToCart, removeFromCart } from '../controllers/cartController.js';
const router = express.Router();
router.get('/:customerId', getCartForCustomer);
router.post('/:customerId/add', addToCart);
router.post('/:customerId/remove', removeFromCart);
export default router;
