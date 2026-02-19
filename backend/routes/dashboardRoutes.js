import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardController';

const router = Router();

// GET dashboard data
router.get('/', getDashboardData);

export default router;