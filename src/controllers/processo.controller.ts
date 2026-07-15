import { Response, NextFunction } from 'express';
import { processoService } from '../services/processo.service';
import { processoCriarSchema } from '../utils/validators';
import { AuthRequest } from '../types';
import { logger } from '../utils/logger';

export const processoController = {
  async criar(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = processoCriarSchema.parse(req.body);
      const processo = await processoService.criar(req.empresa_id!, data as any);

      logger.info('Processo criado', { processo_id: processo.id });

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
      const processo = await processoService.buscar(id, req.empresa_id!);

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
      const processos = await processoService.listar(req.empresa_id!);

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
      const { nova_etapa } = req.body;

      const processo = await processoService.avancarEtapa(id, req.empresa_id!, nova_etapa);

      logger.info('Etapa avançada', { processo_id: id, nova_etapa });

      res.json({
        success: true,
        data: processo,
      });
    } catch (err) {
      next(err);
    }
  },
};
