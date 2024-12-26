import 'dotenv/config';
import express from 'express';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import routes from './routes';
import { Container } from './container';

const app = express();

// initialize DI
Container.init();

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);
export const prismaClient = new PrismaClient({
  log: ['query'],
});
app.use(express.json());

app.use(routes);

app.listen(process.env.PORT || 3344, () => {
  console.log(`Server running on port ${process.env.PORT || 3344}`);
});

process.on('SIGTERM', async () => {
  await Container.disconnect();
  process.exit(0);
});
