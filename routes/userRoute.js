import {
  registerUser,
  getUserProfile,
  authUser,
  logoutUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.post('/', registerUser);
router.get('/', protect, getUserProfile);
router.post('/auth', authUser);
router.post('/logout', logoutUser);
router.put('/profile', protect, updateUser);
router.delete('/profile', protect, deleteUser);

export default router;
