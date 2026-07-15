import { prisma } from '../config/database';
import { BadRequestError, NotFoundError } from '../utils/errors';

export const usuarioRepo = {
  async criar(data: {
    empresaId: string;
    nome: string;
    email: string;
    senhaHash: string;
    role: string;
  }) {
    const existe = await prisma.usuario.findFirst({
      where: { email: data.email },
    });

    if (existe) {
      throw new BadRequestError('Email já cadastrado');
    }

    return prisma.usuario.create({ data });
  },

  async buscarPorEmail(email: string, empresaId: string) {
    return prisma.usuario.findFirst({
      where: { email, empresaId },
    });
  },

  async buscarPorId(id: string, empresaId: string) {
    const usuario = await prisma.usuario.findFirst({
      where: { id, empresaId },
    });

    if (!usuario) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return usuario;
  },
};
