import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';

export const usuarioRepo = {
  async criar(data: {
    empresa_id: string;
    nome: string;
    email: string;
    senha_hash: string;
    role: string;
  }) {
    const existe = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existe) {
      throw new BadRequestError('Email já cadastrado');
    }

    return prisma.usuario.create({ data });
  },

  async buscarPorEmail(email: string, empresa_id: string) {
    return prisma.usuario.findFirst({
      where: { email, empresa_id },
    });
  },

  async buscarPorId(id: string, empresa_id: string) {
    const usuario = await prisma.usuario.findFirst({
      where: { id, empresa_id },
    });

    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return usuario;
  },
};
