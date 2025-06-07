import express from 'express';
import taskRoutes from './routes/task.routes';
const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 5000;

const app = express();

app.get('/', (req, res) => {
  res.send({ message: 'Hello API' });
});

app.use('/api/tasks', taskRoutes);

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
