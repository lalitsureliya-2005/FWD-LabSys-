import express from 'express';
import { addResult, getResults, updateResult } from '../controllers/resultController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', authenticate, authorize(['LabStaff', 'Doctor', 'user']), addResult);
router.get('/', authenticate, getResults);
router.put('/:id', authenticate, authorize(['LabStaff', 'Doctor', 'user']), updateResult);

export default router;
