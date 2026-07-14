import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Servidor operacional', statusCode: 200 });
});

app.get('/api/test', (req, res) => {
  res.json({ success: true, message: 'API funcionando' });
});

const server = app.listen(PORT, () => {
  console.log(`Servidor na porta ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
