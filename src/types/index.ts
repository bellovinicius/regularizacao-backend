import { Request } from 'express';

export interface AuthRequest extends Request {
  usuarioId?: string;
  empresaId?: string;
}

export interface JwtPayload {
  usuarioId: string;
  empresaId: string;
}

export const ETAPAS = [
  { id: 1, nome: 'Lead', dias: 3 },
  { id: 2, nome: 'Qualificação', dias: 5 },
  { id: 3, nome: 'Proposta', dias: 2 },
  { id: 4, nome: 'Contrato', dias: 1 },
  { id: 5, nome: 'Onboarding', dias: 7 },
  { id: 6, nome: 'Análise Técnica', dias: 10 },
  { id: 7, nome: 'Execução CAR', dias: 15 },
  { id: 8, nome: 'Execução PRA', dias: 15 },
  { id: 9, nome: 'Execução CRA', dias: 10 },
  { id: 10, nome: 'Protocolo', dias: 3 },
  { id: 11, nome: 'Acompanhamento', dias: 30 },
  { id: 12, nome: 'Aprovação', dias: 0 },
  { id: 13, nome: 'Entrega', dias: 1 },
];
