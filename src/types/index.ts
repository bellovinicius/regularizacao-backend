export interface JwtPayload {
  usuarioId: string;
  empresaId: string;
  role: string;
  email: string;
}

export interface AuthRequest {
  email: string;
  senha: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode: number;
}

export type RoleType = 'admin' | 'gerente_comercial' | 'vendedor' | 'engenheiro' | 'tecnico' | 'administrativo' | 'cfo';
