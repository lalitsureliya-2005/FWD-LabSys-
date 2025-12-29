import express from 'express';
import { addPatient, getPatients, updatePatient } from '../controllers/patientController.js';
import { authenticate, authorize } from '../middlewares/auth.js';
const router = express.Router();

router.post('/', addPatient);
router.get('/', authenticate, getPatients);
router.put('/:id', authenticate, authorize(['Admin', 'LabStaff']), updatePatient);

export default router;
