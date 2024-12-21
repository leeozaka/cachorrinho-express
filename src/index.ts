import 'dotenv/config';
import express from 'express';
import { DateTime } from 'luxon';
import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import routes from './routes';

DateTime.local().setZone('America/Sao_Paulo');
const app = express();

export const prismaClient = new PrismaClient({
  log: ['query'],
});

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.listen(process.env.PORT || 3344);

app.use(express.json());

app.use(routes);
