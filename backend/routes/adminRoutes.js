import express from 'express';
import { loginAdmin, getAdminById, getAllAdmins, createAdmin, updateAdmin } from '../controllers/adminController.js';

const router = express.Router();

// Login endpoint
router.post('/login', loginAdmin);

// Get all admins
router.get('/', getAllAdmins);

// Get admin by ID
router.get('/:id', getAdminById);

// Create new admin
router.post('/', createAdmin);

// Update admin
router.put('/:id', updateAdmin);

export default router;
