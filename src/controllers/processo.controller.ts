import { Response, NextFunction } from 'express';
import { processoService } from '../services/processo.service';
import { processoCriarSchema } from '../utils/validators';
import { AuthRequest } from '../types';
import { logger } from '../utils/logger';

export const processoController = {
  async criar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsed = processoCriarSchema.parse(req.body);
      const processo = await processoService.criar(req.empresaId!, parsed as any);

      logger.info('Processo criado', { processoId: processo.id });

      res.status(201).json({
        success: true,
        data: processo,
      });
    } catch (err) {
      next(err);
    }
  },

  async buscar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const processo = await processoService.buscar(id, req.empresaId!);

      res.json({
        success: true,
        data: processo,
      });
    } catch (err) {
      next(err);
    }
  },

  async listar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const processos = await processoService.listar(req.empresaId!);

      res.json({
        success: true,
        data: processos,
      });
    } catch (err) {
      next(err);
    }
  },

  async avancarEtapa(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { novaEtapa } = req.body;

      const processo = await processoService.avancarEtapa(id, req.empresaId!, novaEtapa);

      logger.info('Etapa avançada', { processoId: id, novaEtapa });

      res.json({
        success: true,
        data: processo,
      });
    } catch (err) {
      next(err);
    }
  },
};
