import bcrypt from 'bcryptjs';
import { prisma } from '../config/database';
import { generateToken } from '../utils/jwt';
import { ConflictError, UnauthorizedError } from '../utils/errors';
import { usuarioRepo } from '../repositories/usuario.repo';

export const authService = {
  async registro(data: {
    nome: string;
    email: string;
    senha: string;
    razaoSocial: string;
    cnpj: string;
  }) {
    const empresaExiste = await prisma.empresa.findUnique({
      where: { cnpj: data.cnpj },
    });

    if (empresaExiste) {
      throw new ConflictError('CNPJ já cadastrado');
    }

    const empresa = await prisma.empresa.create({
      data: {
        razaoSocial: data.razaoSocial,
        cnpj: data.cnpj,
      },
    });

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = await usuarioRepo.criar({
      empresaId: empresa.id,
      nome: data.nome,
      email: data.email,
      senhaHash: senhaHash,
      role: 'admin',
    });

    const token = generateToken({
      usuarioId: usuario.id,
      empresaId: empresa.id,
    });

    return {
      empresaId: empresa.id,
      usuarioId: usuario.id,
      token,
    };
  },

  async login(email: string, senha: string, empresaId: string) {
    const usuario = await usuarioRepo.buscarPorEmail(email, empresaId);

    if (!usuario) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);

    if (!senhaValida) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = generateToken({
      usuarioId: usuario.id,
      empresaId,
    });

    return { token };
  },
};
