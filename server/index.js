import express from 'express';
import cors from 'cors';
import { checkBotStatus, getBotLogs } from './botStatus.js';

const app = express();
const port = 5050;

app.use(cors());

app.get('/api/bot-status', async (req, res) => {
  const status = await checkBotStatus();
  res.json(status);
});

app.get('/api/bot-logs', async (req, res) => {
  try {
    const data = await getBotLogs();
    res.json(data); // Отправляем ответ напрямую, без дополнительного оборачивания
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs', error });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});
