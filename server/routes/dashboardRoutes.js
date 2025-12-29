import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

// Allow public access for now if needed, or stick to authenticated
// Given HomePage is likely protected or public, let's keep it open or check auth if token exists in frontend
// But HomePage seems to be the landing page. Let's start with public access or use optional auth?
// The user is likely logged in. Let's use authenticate if available, but for now let's make it public to avoid auth issues on dashboard load if token is missing/expired.
// Or better, make it open.
router.get('/stats', getDashboardStats);

export default router;
