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

    req.usuarioId = payload.usuarioId;
    req.empresaId = payload.empresaId;

    next();
  } catch (err) {
    throw new UnauthorizedError('Token inválido');
  }
};
