import { Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { registroSchema, loginSchema } from '../utils/validators';
import { AuthRequest } from '../types';
import { logger } from '../utils/logger';

export const authController = {
  async registro(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const data = registroSchema.parse(req.body);
      const resultado = await authService.registro(data);

      logger.info('Novo usuário registrado', { empresa_id: resultado.empresa_id });

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
      const { email, senha, empresa_id } = loginSchema.parse(req.body);
      const resultado = await authService.login(email, senha, empresa_id);

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
          usuario_id: req.usuario_id,
          empresa_id: req.empresa_id,
        },
      });
    } catch (err) {
      next(err);
    }
  },
};
