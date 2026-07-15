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
