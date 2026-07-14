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
  res.json({ success: true, message: 'OK', statusCode: 200 });
});

const server = app.listen(PORT, () => console.log(`Port ${PORT}`));
process.on('SIGTERM', () => server.close(() => process.exit(0)));
