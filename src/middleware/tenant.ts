import { Request, Response, NextFunction } from 'express';

export function tenantMiddleware(
  req: any,
  res: Response,
  next: NextFunction
): void {
  if (!req.usuario) {
    res.status(401).json({
      success: false,
      error: 'Não autenticado',
      statusCode: 401,
    });
    return;
  }

  req.empresaId = req.usuario.empresaId;
  next();
}

export function getEmpresaIdFromRequest(req: any): string {
  if (!req.usuario) {
    throw new Error('Usuário não autenticado');
  }
  return req.usuario.empresaId;
}
