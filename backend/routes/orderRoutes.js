import express from 'express';
import { createOrder } from '../controllers/orderController.js';
const router = express.Router();
router.post('/:customerId/create', createOrder);
export default router;
