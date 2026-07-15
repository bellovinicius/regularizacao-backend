import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const processoRepo = {
  async criar(data: {
    empresaId: string;
    numero: string;
    produtorNome: string;
    produtorEmail: string;
    produtorTelefone: string;
    valorTotal: number;
  }) {
    return prisma.processo.create({
      data: {
        ...data,
        valorTotal: Number(data.valorTotal),
      },
    });
  },

  async buscarPorId(id: string, empresaId: string) {
    const processo = await prisma.processo.findFirst({
      where: { id, empresaId },
      include: {
        documentos: true,
        pagamentos: true,
      },
    });

    if (!processo) {
      throw new NotFoundError('Processo não encontrado');
    }

    return processo;
  },

  async listarPorEmpresa(empresaId: string, skip = 0, take = 10) {
    return prisma.processo.findMany({
      where: { empresaId },
      skip,
      take,
      orderBy: { criadoEm: 'desc' },
    });
  },

  async avancarEtapa(id: string, empresaId: string, novaEtapa: number) {
    const processo = await this.buscarPorId(id, empresaId);

    if (novaEtapa <= processo.etapaAtual) {
      throw new Error('Etapa deve ser maior que a atual');
    }

    const percentual = Math.floor((novaEtapa / 13) * 100);

    return prisma.processo.update({
      where: { id },
      data: {
        etapaAtual: novaEtapa,
        percentual,
      },
    });
  },
};
