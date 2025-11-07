import express from 'express';
import { createCustomer, getCustomerById } from '../controllers/customerController.js';
const router = express.Router();
router.post('/', createCustomer);
router.get('/:id', getCustomerById);
export default router;
