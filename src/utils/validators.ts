import { z } from 'zod';

export const registroSchema = z.object({
  nome: z.string().min(3).transform(v => v || ''),
  email: z.string().email().transform(v => v || ''),
  senha: z.string().min(8).transform(v => v || ''),
  razao_social: z.string().min(3).transform(v => v || ''),
  cnpj: z.string().regex(/^\d{14}/).transform(v => v || ''),
});

export const loginSchema = z.object({
  email: z.string().email().transform(v => v || ''),
  senha: z.string().min(1).transform(v => v || ''),
  empresa_id: z.string().min(1).transform(v => v || ''),
});

export const processoCriarSchema = z.object({
  produtor_nome: z.string().min(1).transform(v => v || ''),
  produtor_email: z.string().email().transform(v => v || ''),
  produtor_telefone: z.string().min(1).transform(v => v || ''),
  valor_total: z.number().positive().transform(v => v || 0),
});

export const documentoUploadSchema = z.object({
  tipo: z.string().min(1).transform(v => v || ''),
});

export const pagamentoSchema = z.object({
  valor: z.number().positive().transform(v => v || 0),
  tipo: z.enum(['pix', 'boleto']).transform(v => v || 'pix'),
});
