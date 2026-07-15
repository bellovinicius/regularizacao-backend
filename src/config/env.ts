import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('24h'),
  S3_BUCKET: z.string().optional(),
  S3_REGION: z.string().optional(),
  ASAAS_API_KEY: z.string().optional(),
});

export const env = envSchema.parse(process.env);
