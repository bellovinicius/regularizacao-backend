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
    razao_social: string;
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
        razao_social: data.razao_social,
        cnpj: data.cnpj,
      },
    });

    const senhaHash = await bcrypt.hash(data.senha, 10);

    const usuario = await usuarioRepo.criar({
      empresa_id: empresa.id,
      nome: data.nome,
      email: data.email,
      senha_hash: senhaHash,
      role: 'admin',
    });

    const token = generateToken({
      usuario_id: usuario.id,
      empresa_id: empresa.id,
    });

    return {
      empresa_id: empresa.id,
      usuario_id: usuario.id,
      token,
    };
  },

  async login(email: string, senha: string, empresa_id: string) {
    const usuario = await usuarioRepo.buscarPorEmail(email, empresa_id);

    if (!usuario) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);

    if (!senhaValida) {
      throw new UnauthorizedError('Credenciais inválidas');
    }

    const token = generateToken({
      usuario_id: usuario.id,
      empresa_id,
    });

    return { token };
  },
};
