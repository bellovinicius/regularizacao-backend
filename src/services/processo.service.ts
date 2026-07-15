import { processoRepo } from '../repositories/processo.repo';
import { prisma } from '../config/database';
import { ETAPAS } from '../types';

export const processoService = {
  async criar(empresaId: string, data: {
    produtorNome: string;
    produtorEmail: string;
    produtorTelefone: string;
    valorTotal: number;
  }) {
    const count = await prisma.processo.count({ where: { empresaId } });
    const numero = `PROC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return processoRepo.criar({
      empresaId,
      numero,
      ...data,
    });
  },

  async buscar(id: string, empresaId: string) {
    const processo = await processoRepo.buscarPorId(id, empresaId);
    const etapaAtual = ETAPAS.find(e => e.id === processo.etapaAtual);

    return {
      ...processo,
      etapaAtualNome: etapaAtual?.nome,
    };
  },

  async listar(empresaId: string) {
    return processoRepo.listarPorEmpresa(empresaId);
  },

  async avancarEtapa(id: string, empresaId: string, novaEtapa: number) {
    if (novaEtapa < 1 || novaEtapa > 13) {
      throw new Error('Etapa inválida');
    }

    return processoRepo.avancarEtapa(id, empresaId, novaEtapa);
  },
};
