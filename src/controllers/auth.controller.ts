import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registroSchema, loginSchema } from '../utils/validators';
import { AuthRequest } from '../types';
import { logger } from '../utils/logger';

export const authController = {
  async registro(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsed = registroSchema.parse(req.body);
      const resultado = await authService.registro(parsed as any);

      logger.info('Novo usuário registrado', { empresaId: resultado.empresaId });

      res.status(201).json({
        success: true,
        data: resultado,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsed = loginSchema.parse(req.body);
      const { email, senha, empresaId } = parsed as any;
      const resultado = await authService.login(email, senha, empresaId);

      res.json({
        success: true,
        data: resultado,
      });
    } catch (err) {
      next(err);
    }
  },

  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: {
          usuarioId: req.usuarioId,
          empresaId: req.empresaId,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
