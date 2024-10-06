import pm2 from 'pm2';
import fs from 'fs';
import path from 'path';

let lastLogContent = ''; // Храним последнее содержимое логов

export function checkBotStatus() {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        console.error('PM2 connection error:', err);
        reject({ status: 'Inactive' });
      }

      pm2.describe('medBot', (err, processDescription) => {
        if (err || !processDescription || processDescription.length === 0) {
          console.error('Error fetching process description:', err);
          resolve({ status: 'Inactive' });
        } else {
          const status = processDescription[0].pm2_env.status;
          resolve({ status: status === 'online' ? 'Active' : 'Inactive' });
        }
        pm2.disconnect();
      });
    });
  });
}

export function getBotLogs() {
  return new Promise((resolve, reject) => {
    const logFilePath = path.resolve('/root/.pm2/logs/medBot-error.log'); // путь к логу ошибок

    fs.readFile(logFilePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error reading log file:', err); // Логируем ошибку чтения файла
        reject({ message: 'Error fetching logs', error: err });
      } else {
        // Фильтруем строки, которые содержат только MongoDB предупреждения
        const warningLogs = data
          .split('\n')
          .filter((line) => line.includes('[MONGODB DRIVER] Warning'));
        const warningCount = warningLogs.length; // Подсчитываем количество предупреждений

        // Преобразуем логи в формат, который можно будет корректно вывести в JSON
        const formattedLogs = data.replace(/\n/g, '\\n'); // Экранируем новые строки

        // Возвращаем JSON объект с логами и количеством предупреждений
        resolve({
          logs: formattedLogs, // Логи с экранированными переносами строк
          warningCount,
          message: 'Logs and warning count fetched successfully',
        });
      }
    });
  });
}
