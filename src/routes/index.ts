import { Router } from 'express';
import authRoutes from './auth.routes';
import processoRoutes from './processo.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/processos', processoRoutes);

export default router;
