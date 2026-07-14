import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

const ProcessoSchema = z.object({
  cliente_id: z.string().uuid(),
  numero_processo: z.string(),
  valor_total: z.number(),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const empresaId = req.headers['x-empresa-id'] as string;
    const data = ProcessoSchema.parse(req.body);

    const processo = await prisma.processo.create({
      data: {
        ...data,
        empresa_id: empresaId,
        etapa_atual: 1,
        status: 'ativo',
        data_sla_esperada: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.etapa_processo.create({
      data: {
        processo_id: processo.id,
        numero_etapa: 1,
        status: 'em_progresso',
        data_sla_esperada: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ success: true, data: processo });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/', async (req: Request, res: Response) => {
  try {
    const empresaId = req.headers['x-empresa-id'] as string;
    const status = req.query.status as string;

    const processos = await prisma.processo.findMany({
      where: {
        empresa_id: empresaId,
        ...(status && { status }),
      },
      include: {
        cliente: true,
        etapas: { orderBy: { numero_etapa: 'asc' } },
      },
      orderBy: { data_criacao: 'desc' },
    });

    res.json({ success: true, data: processos });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;

    const processo = await prisma.processo.findFirst({
      where: { id, empresa_id: empresaId },
      include: {
        cliente: true,
        etapas: { orderBy: { numero_etapa: 'asc' } },
        documentos: true,
        pagamentos: true,
      },
    });

    if (!processo) {
      return res.status(404).json({ success: false, message: 'Processo não encontrado' });
    }

    res.json({ success: true, data: processo });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;
    const data = ProcessoSchema.partial().parse(req.body);

    const processo = await prisma.processo.updateMany({
      where: { id, empresa_id: empresaId },
      data,
    });

    res.json({ success: true, data: processo });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/:id/avancar-etapa', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;

    const processo = await prisma.processo.findFirst({
      where: { id, empresa_id: empresaId },
    });

    if (!processo) {
      return res.status(404).json({ success: false, message: 'Processo não encontrado' });
    }

    if (processo.etapa_atual >= 13) {
      return res.status(400).json({ success: false, message: 'Processo já concluído' });
    }

    const novaEtapa = processo.etapa_atual + 1;

    await prisma.processo.update({
      where: { id },
      data: { etapa_atual: novaEtapa },
    });

    await prisma.etapa_processo.create({
      data: {
        processo_id: id,
        numero_etapa: novaEtapa,
        status: 'em_progresso',
        data_sla_esperada: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    });

    res.json({ success: true, message: `Processo avançado para etapa ${novaEtapa}` });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/:id/bloquear-etapa', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    const empresaId = req.headers['x-empresa-id'] as string;

    const processo = await prisma.processo.findFirst({
      where: { id, empresa_id: empresaId },
    });

    if (!processo) {
      return res.status(404).json({ success: false, message: 'Processo não encontrado' });
    }

    await prisma.etapa_processo.updateMany({
      where: { processo_id: id, numero_etapa: processo.etapa_atual },
      data: { status: 'bloqueada', motivo_bloqueio: motivo },
    });

    res.json({ success: true, message: 'Etapa bloqueada' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/:id/reciclar-etapa', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;

    const processo = await prisma.processo.findFirst({
      where: { id, empresa_id: empresaId },
    });

    if (!processo) {
      return res.status(404).json({ success: false, message: 'Processo não encontrado' });
    }

    await prisma.etapa_processo.updateMany({
      where: { processo_id: id, numero_etapa: processo.etapa_atual },
      data: { status: 'em_progresso', tentativas_rejeicao: { increment: 1 } },
    });

    res.json({ success: true, message: 'Etapa reciclada' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.post('/:id/cancelar', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const empresaId = req.headers['x-empresa-id'] as string;

    await prisma.processo.updateMany({
      where: { id, empresa_id: empresaId },
      data: { status: 'cancelado' },
    });

    res.json({ success: true, message: 'Processo cancelado' });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;
