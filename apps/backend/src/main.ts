import 'dotenv/config';
import express from 'express';
import taskRoutes from './routes/task.routes';
import { AppError } from './utils/AppError';
import { errorHandler } from './middlewares/errorHandler';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

export const app = express();
app.use(express.json());

app.get('/', (_req, res) => {
  res.send({ message: 'Hello API' });
});

app.get('/health', (_req, res) => {
  res.status(200).send({ status: 'ok' });
});

app.use('/api/tasks', taskRoutes);

// 404 handler
app.use((_req, _res, next) => {
  next(new AppError('Route not found', 404));
});

app.use(errorHandler);

// Only listen if not in test mode
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, host, () => {
    console.log(`[ ready ] http://${host}:${port}`);
  });
}
