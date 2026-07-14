import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  usuario?: any;
}

export function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Token não fornecido',
        statusCode: 401,
      });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Token inválido',
      statusCode: 401,
    });
  }
}

export function generateToken(payload: any): string {
  return jwt.sign(payload, process.env.JWT_SECRET || 'secret', {
    expiresIn: process.env.JWT_EXPIRE_IN || '7d',
  });
}
