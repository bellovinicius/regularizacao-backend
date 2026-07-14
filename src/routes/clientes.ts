import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const ClienteSchema = z.object({
  nome: z.string().min(3),
  cpf_cnpj: z.string().length(14),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  endereco: z.string().optional(),
});

const BANTSchema = z.object({
  budget: z.number().optional(),
  authority: z.boolean().optional(),
  need: z.boolean().optional(),
  timeline: z.string().optional(),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const empresaId = req.headers['x-empresa-id'] as string;
    const data = ClienteSchema.parse(req.body);

    const cliente = await prisma.cliente.create({
      data: {
        ...data,
        empresa_id: empresaId,
        status: 'lead',
      },
    });

    res.json({ success: true, data: cliente });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const empresaId = req.headers['x-empresa-id'] as string;
    const status = req.query.status as string;

    const clientes = await prisma.cliente.findMany({
      where: {
        empresa_id: empresaId,
        ...(status && { status }),
      },
      orderBy: { data_primeira_interacao: 'desc' },
    });

    res.json({ success: true, data: clientes });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;

    const cliente = await prisma.cliente.findFirst({
      where: { id, empresa_id: empresaId },
      include: { processos: true },
    });

    if (!cliente) {
      return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    }

    res.json({ success: true, data: cliente });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;
    const data = ClienteSchema.partial().parse(req.body);

    const cliente = await prisma.cliente.updateMany({
      where: { id, empresa_id: empresaId },
      data,
    });

    res.json({ success: true, data: cliente });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;

    await prisma.cliente.deleteMany({
      where: { id, empresa_id: empresaId },
    });

    res.json({ success: true, message: 'Cliente deletado' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/:id/bant-score', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;
    const bant = BANTSchema.parse(req.body);

    let score = 0;
    if (bant.budget) score += 25;
    if (bant.authority) score += 25;
    if (bant.need) score += 25;
    if (bant.timeline) score += 25;

    const cliente = await prisma.cliente.updateMany({
      where: { id, empresa_id: empresaId },
      data: { score_bant: score },
    });

    res.json({ success: true, data: { score } });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
