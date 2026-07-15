import axios from 'axios';

const API_URL = 'https://regularizacao-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  registro: (data: {
    nome: string;
    email: string;
    senha: string;
    razaoSocial: string;
    cnpj: string;
  }) => api.post('/auth/registro', data),

  login: (email: string, senha: string, empresaId: string) =>
    api.post('/auth/login', { email, senha, empresaId }),

  me: () => api.get('/auth/me'),
};

export const processoService = {
  criar: (data: {
    produtorNome: string;
    produtorEmail: string;
    produtorTelefone: string;
    valorTotal: number;
  }) => api.post('/processos', data),

  listar: () => api.get('/processos'),

  buscar: (id: string) => api.get(`/processos/${id}`),

  avancarEtapa: (id: string, novaEtapa: number) =>
    api.post(`/processos/${id}/avancar-etapa`, { novaEtapa }),
};

export default api;
