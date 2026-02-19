import { Router } from 'express';
import { getDashboardData } from '../controllers/dashboardControllers';

const router = Router();

// GET dashboard data
router.get('/', getDashboardData);

export default router;