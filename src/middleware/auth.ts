import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../utils/errors';
import { verifyToken } from '../utils/jwt';
import { AuthRequest } from '../types';

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Token não fornecido');
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    req.usuario_id = payload.usuario_id;
    req.empresa_id = payload.empresa_id;

    next();
  } catch (err) {
    throw new UnauthorizedError('Token inválido');
  }
};
