import { prisma } from '../config/database';
import { NotFoundError } from '../utils/errors';

export const processoRepo = {
  async criar(data: {
    empresa_id: string;
    numero: string;
    produtor_nome: string;
    produtor_email: string;
    produtor_telefone: string;
    valor_total: number;
  }) {
    return prisma.processo.create({ data });
  },

  async buscarPorId(id: string, empresa_id: string) {
    const processo = await prisma.processo.findFirst({
      where: { id, empresa_id },
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

  async listarPorEmpresa(empresa_id: string, skip = 0, take = 10) {
    return prisma.processo.findMany({
      where: { empresa_id },
      skip,
      take,
      orderBy: { created_at: 'desc' },
    });
  },

  async avancarEtapa(id: string, empresa_id: string, novaEtapa: number) {
    const processo = await this.buscarPorId(id, empresa_id);

    if (novaEtapa <= processo.etapa_atual) {
      throw new Error('Etapa deve ser maior que a atual');
    }

    const percentual = Math.floor((novaEtapa / 13) * 100);

    return prisma.processo.update({
      where: { id },
      data: {
        etapa_atual: novaEtapa,
        percentual,
      },
    });
  },
};
