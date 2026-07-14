import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'OK', statusCode: 200 });
});

app.post('/api/auth/registro', async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, razao_social, cnpj } = req.body;
    const empresa = await prisma.empresa.create({
      data: { razao_social, cnpj, plano: 'basic', ativo: true }
    });
    const senhaHash = await bcrypt.hash(senha, 10);
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha_hash: senhaHash, empresa_id: empresa.id, role: 'administrativo', ativo: true }
    });
    const token = jwt.sign({ usuarioId: usuario.id, empresaId: empresa.id }, process.env.JWT_SECRET || 'chave', { expiresIn: '24h' });
    res.json({ success: true, data: { empresaId: empresa.id, usuarioId: usuario.id, token } });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const usuario = await prisma.usuario.findFirst({ where: { email } });
    if (!usuario) return res.status(401).json({ success: false, message: 'Invalido' });
    const ok = await bcrypt.compare(senha, usuario.senha_hash);
    if (!ok) return res.status(401).json({ success: false, message: 'Invalido' });
    const token = jwt.sign({ usuarioId: usuario.id, empresaId: usuario.empresa_id }, process.env.JWT_SECRET || 'chave', { expiresIn: '24h' });
    res.json({ success: true, data: { token } });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
});

const server = app.listen(PORT, () => console.log(`Port ${PORT}`));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
