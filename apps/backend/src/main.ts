import 'dotenv/config';
import express from 'express';
import taskRoutes from './routes/task.routes';
import { AppError } from './utils/AppError';
import { errorHandler } from './middlewares/errorHandler';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();
app.use(express.json());
app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use('/api/tasks', taskRoutes);
app.use((_req, _res, next) => {
  next(new AppError('Route not found', 404));
});
app.use(errorHandler);
app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
