import { z } from 'zod';

export const registroSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(8),
  razaoSocial: z.string().min(3),
  cnpj: z.string().regex(/^\d{14}$/),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(1),
  empresaId: z.string().uuid(),
});

export const processoCriarSchema = z.object({
  produtorNome: z.string().min(1),
  produtorEmail: z.string().email(),
  produtorTelefone: z.string().min(1),
  valorTotal: z.number().positive(),
});

export const documentoUploadSchema = z.object({
  tipo: z.string().min(1),
});

export const pagamentoSchema = z.object({
  valor: z.number().positive(),
  tipo: z.enum(['pix', 'boleto']),
});
