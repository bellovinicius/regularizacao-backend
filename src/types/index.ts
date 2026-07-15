import { Request } from 'express';

export interface Empresa {
  id: string;
  razaoSocial: string;
  cnpj: string;
  plano: string;
  ativo: boolean;
}

export interface Usuario {
  id: string;
  empresaId: string;
  nome: string;
  email: string;
  role: string;
}

export interface Processo {
  id: string;
  empresaId: string;
  numero: string;
  produtorNome: string;
  produtorEmail: string;
  produtorTelefone: string;
  etapaAtual: number;
  etapaAtualNome?: string;
  percentual: number;
  valorTotal: string | number;
  valorPago: string | number;
  status: string;
  documentos: any[];
  pagamentos: any[];
  criadoEm: string;
  atualizadoEm: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    empresaId: string;
    usuarioId: string;
    token: string;
  };
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
  };
}

export interface AuthRequest extends Request {
  user?: {
    empresaId?: string;
    usuarioId?: string;
    email?: string;
    role?: string;
  };
  empresaId?: string;
  usuarioId?: string;
  email?: string;
  role?: string;
}

export interface JwtPayload {
  empresaId: string;
  usuarioId: string;
  email?: string;
  role?: string;
  iat?: number;
  exp?: number;
}

export const ETAPAS = [
  { id: 1, nome: 'Cadastro' },
  { id: 2, nome: 'Documentação Inicial' },
  { id: 3, nome: 'Análise Técnica' },
  { id: 4, nome: 'Validação de Dados' },
  { id: 5, nome: 'Parcelamento' },
  { id: 6, nome: 'Regularização' },
  { id: 7, nome: 'Compatibilização' },
  { id: 8, nome: 'Laudo' },
  { id: 9, nome: 'Pagamento' },
  { id: 10, nome: 'Envio ao Órgão' },
  { id: 11, nome: 'Acompanhamento' },
  { id: 12, nome: 'Concluído' },
  { id: 13, nome: 'Arquivado' },
];
