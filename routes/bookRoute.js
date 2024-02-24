import express from 'express';
import {
  getPublicBooks,
  getPrivateBooks,
  createBook,
  deleteBook,
  updateBook,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();



router.get('/', getPublicBooks);
router.get('/me', protect,  getPrivateBooks);
router.post('/', protect, createBook);
router.put('/:id', protect, updateBook);
router.delete('/:id', protect, deleteBook);

export default router;
