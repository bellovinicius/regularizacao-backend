import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

export const tenantMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.empresaId) {
    return res.status(401).json({ success: false, message: 'Tenant ID não identificado' });
  }
  next();
};
