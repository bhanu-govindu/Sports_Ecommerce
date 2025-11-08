import express from 'express';
import { createOrder, getAllOrders, updateOrderStatus, getOrderById, getOrdersByCustomer } from '../controllers/orderController.js';
const router = express.Router();

// create order for a customer
router.post('/:customerId/create', createOrder);

// admin: get all orders
router.get('/', getAllOrders);

// admin: update order status
router.put('/:orderId/status', updateOrderStatus);

// get orders for a customer (with items) - specific route first
router.get('/customer/:customerId', getOrdersByCustomer);

// get order by id (with items)
router.get('/:orderId', getOrderById);

export default router;
