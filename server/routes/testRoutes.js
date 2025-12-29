import express from 'express';
import { addTest, getTests, updateTest } from '../controllers/testController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', authenticate, authorize(['Admin']), addTest);
router.get('/', getTests);
router.put('/:id', authenticate, authorize(['Admin']), updateTest);

export default router;
