import { z } from 'zod';

export const registroSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(8),
  razao_social: z.string().min(3),
  cnpj: z.string().regex(/^\d{14}$/),
});

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string(),
});

export const processoCriarSchema = z.object({
  produtor_nome: z.string(),
  produtor_email: z.string().email(),
  produtor_telefone: z.string(),
  valor_total: z.number().positive(),
});

export const documentoUploadSchema = z.object({
  tipo: z.string(),
});

export const pagamentoSchema = z.object({
  valor: z.number().positive(),
  tipo: z.enum(['pix', 'boleto']),
});
