import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const RegistroSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(8),
  razao_social: z.string().min(3),
  cnpj: z.string().length(14),
});

const LoginSchema = z.object({
  email: z.string().email(),
  senha: z.string(),
});

router.post('/registro', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, razao_social, cnpj } = RegistroSchema.parse(req.body);

    const empresaExistente = await prisma.empresa.findUnique({
      where: { cnpj },
    });

    if (empresaExistente) {
      return res.status(400).json({ success: false, message: 'CNPJ já registrado' });
    }

    const usuarioExistente = await prisma.usuario.findFirst({
      where: { email },
    });

    if (usuarioExistente) {
      return res.status(400).json({ success: false, message: 'Email já registrado' });
    }

    const empresa = await prisma.empresa.create({
      data: {
        razao_social,
        cnpj,
        plano: 'basic',
        ativo: true,
      },
    });

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha_hash: senhaHash,
        empresa_id: empresa.id,
        role: 'administrativo',
        ativo: true,
      },
    });

    const token = jwt.sign(
      { usuarioId: usuario.id, empresaId: empresa.id, role: usuario.role },
      process.env.JWT_SECRET || 'sua-chave-secreta',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Empresa e usuário registrados com sucesso',
      data: {
        empresaId: empresa.id,
        usuarioId: usuario.id,
        token,
      },
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message || 'Erro ao registrar',
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } =
