import express from 'express';
import cors from 'cors';
import { checkBotStatus, getBotLogs } from './botStatus.js';

const app = express();
const port = 5000;

app.use(cors());

app.get('/api/bot-status', async (req, res) => {
  const status = await checkBotStatus();
  res.json(status);
});

app.get('/api/bot-logs', async (req, res) => {
  const logs = await getBotLogs();
  res.json({ logs });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
