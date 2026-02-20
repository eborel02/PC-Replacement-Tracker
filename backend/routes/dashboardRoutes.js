import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController.js';

const router = Router();

// GET dashboard data
router.get('/', getDashboardData);

export default router;