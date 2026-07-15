import { processoRepo } from '../repositories/processo.repo';
import { prisma } from '../config/database';
import { ETAPAS } from '../types';

export const processoService = {
  async criar(empresa_id: string, data: {
    produtor_nome: string;
    produtor_email: string;
    produtor_telefone: string;
    valor_total: number;
  }) {
    const count = await prisma.processo.count({ where: { empresa_id } });
    const numero = `PROC-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    return processoRepo.criar({
      empresa_id,
      numero,
      ...data,
    });
  },

  async buscar(id: string, empresa_id: string) {
    const processo = await processoRepo.buscarPorId(id, empresa_id);
    const etapaAtual = ETAPAS.find(e => e.id === processo.etapa_atual);

    return {
      ...processo,
      etapa_atual_nome: etapaAtual?.nome,
    };
  },

  async listar(empresa_id: string) {
    return processoRepo.listarPorEmpresa(empresa_id);
  },

  async avancarEtapa(id: string, empresa_id: string, novaEtapa: number) {
    if (novaEtapa < 1 || novaEtapa > 13) {
      throw new Error('Etapa inválida');
    }

    return processoRepo.avancarEtapa(id, empresa_id, novaEtapa);
  },
};
