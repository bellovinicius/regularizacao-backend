import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRouter from './routes/auth';
import clientesRouter from './routes/clientes';
import processosRouter from './routes/processos';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor operacional',
    statusCode: 200,
  });
});

app.use('/api/auth', authRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/processos', processosRouter);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada',
  });
});

const server = app.listen(PORT, () => {
  console.log(`✓ Servidor iniciado em http://localhost:${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM recebido. Encerrando...');
  server.close(() => process.exit(0));
});
