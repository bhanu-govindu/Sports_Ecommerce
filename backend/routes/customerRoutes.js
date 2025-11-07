import express from 'express';
import { createCustomer, getCustomerById, loginCustomer, updateCustomer } from '../controllers/customerController.js';
const router = express.Router();
router.post('/', createCustomer);
router.post('/login', loginCustomer);
router.get('/:id', getCustomerById);
router.put('/:id', updateCustomer);
export default router;
