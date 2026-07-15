import { Router } from 'express';
import { processoController } from '../controllers/processo.controller';
import { authMiddleware } from '../middleware/auth';
import { tenantMiddleware } from '../middleware/tenant';

const router = Router();

router.use(authMiddleware, tenantMiddleware);

router.post('/', processoController.criar);
router.get('/', processoController.listar);
router.get('/:id', processoController.buscar);
router.post('/:id/avancar-etapa', processoController.avancarEtapa);

export default router;
