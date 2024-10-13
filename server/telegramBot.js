import TelegramBot from 'node-telegram-bot-api';
import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

// Токен твоего Telegram бота
const token = '7196013425:AAEJs0bpbg_Dklv0OI0YeX_2mzSPVqjRyR4';
const chatId = -4208398785; // Chat ID для отправки уведомлений, не будет изменяться

// Путь к JSON-файлу для хранения логов
const logsFilePath = path.resolve('previousLogs.json');

// Создаем экземпляр бота
const bot = new TelegramBot(token, { polling: true });

// Функция для чтения предыдущих логов из файла
const readPreviousLogs = async () => {
  try {
    const data = await fs.readFile(logsFilePath, 'utf8');
    console.log('Прочитаны предыдущие логи из файла.');
    return JSON.parse(data).logs || '';
  } catch (error) {
    console.log('Предыдущие логи не найдены, начинается новая запись.');
    return ''; // Если файл не найден или ошибка — возвращаем пустую строку
  }
};

// Функция для записи логов в файл
const writeLogsToFile = async (logs) => {
  try {
    const data = { logs };
    await fs.writeFile(logsFilePath, JSON.stringify(data), 'utf8');
    console.log('Текущие логи сохранены в файл.');
  } catch (error) {
    console.error('Ошибка при записи логов в файл:', error.message);
  }
};

// Функция для отправки уведомления в Telegram
const sendNotification = async (message) => {
  try {
    await bot.sendMessage(chatId, message);
    console.log(`Уведомление отправлено в чат ${chatId}`);
  } catch (error) {
    console.error(`Не удалось отправить сообщение: ${error.message}`);
  }
};

// Функция для сравнения логов и отправки уведомления при изменениях
const checkForLogChanges = async () => {
  try {
    // Загружаем предыдущие логи из файла
    const previousLogs = await readPreviousLogs();
    console.log(`Предыдущие логи загружены: ${previousLogs.length} символов`);

    // Получаем текущие логи с эндпоинта
    console.log('Отправляем запрос на сервер для получения текущих логов...');
    const response = await fetch('https://danya1733.ru/api/bot-logs');
    const data = await response.json();
    const currentLogs = data.logs.replace(/\\n/g, '\n'); // Текущие логи
    console.log('Ответ с сервера получен, текущие логи загружены.');

    const currentWarningCount = data.warningCount;
    console.log(`Количество ошибок в текущих логах: ${currentWarningCount}`);
    
    // Проверяем, изменились ли логи по сравнению с предыдущей версией
    if (currentLogs !== previousLogs) {
      console.log('Логи изменились, отправляем уведомление.');
      await sendNotification('⚠️ Обнаружена ошибка в работе бота. Пожалуйста, зайдите на http://danya1733.ru для подробной информации.');
      
      // Обновляем файл с логами
      await writeLogsToFile(currentLogs);
    } else {
      console.log('Изменений в логах не обнаружено.');
    }

    console.log(`Предыдущее количество ошибок: ${previousLogs.length}, текущее количество: ${currentLogs.length}`);
  } catch (error) {
    console.error('Ошибка при получении логов или их сравнении:', error.message);
  }
};

// Интервал для проверки логов каждую секунду (1000 мс)
setInterval(checkForLogChanges, 60000);

// Команда /chatid, которая больше не обновляет chatId
bot.onText(/\/chatid/, async (msg) => {
  try {
    await bot.sendMessage(chatId, `Chat ID: ${chatId}`);
    console.log(`Chat ID отправлен: ${chatId}`);
  } catch (error) {
    console.error(`Не удалось отправить Chat ID: ${error.message}`);
  }
});

console.log('Telegram bot is running asynchronously...');
