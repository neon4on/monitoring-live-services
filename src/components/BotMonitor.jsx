import React, { useState, useEffect } from 'react';
import './BotMonitor.css';

function BotMonitor({ botName }) {
  const [status, setStatus] = useState('Checking...');
  const [downtimes, setDowntimes] = useState(0); // Изначально 0
  const [logs, setLogs] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Функция для загрузки логов
  const fetchLogs = async () => {
    try {
      const response = await fetch('https://danya1733.ru/api/bot-logs');
      const data = await response.json();
      const formattedLogs = data.logs.replace(/\\n/g, '\n');
      setLogs(formattedLogs); // Устанавливаем логи
      setDowntimes(data.warningCount); // Устанавливаем количество предупреждений
    } catch (error) {
      setLogs('Failed to load logs.');
    }
  };

  // Загрузка статуса и логов
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://danya1733.ru/api/bot-status');
        const data = await response.json();
        setStatus(data.status);

        if (!initialized) {
          setInitialized(true);
        } else if (data.status === 'Inactive') {
          setDowntimes((prev) => prev + 1);
        }
      } catch (error) {
        if (initialized) {
          setStatus('Inactive');
          setDowntimes((prev) => prev + 1);
        }
      }
    };

    // При первой загрузке выполняем обе функции
    fetchStatus();
    fetchLogs();

    // Обновляем статус и логи каждые 5 минут
    const interval = setInterval(() => {
      fetchStatus();
      fetchLogs();
    }, 300000); // 5 минут = 300000 мс

    return () => clearInterval(interval);
  }, [initialized]);

  return (
    <div className="bot-monitor">
      <h2>{botName}</h2>
      <p>
        Status: <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </p>
      <p>
        Downtimes (Warnings/Errors):{' '}
        <span className={downtimes > 0 ? 'downtimes-warning' : ''}>{downtimes}</span>
      </p>{' '}
      <button className="details-button" onClick={() => setShowLogs(true)}>
        Подробнее
      </button>
      {showLogs && (
        <div className="modal" onClick={() => setShowLogs(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowLogs(false)}>
              &times;
            </span>
            <h3>Logs for {botName}</h3>
            <pre className="logs">{logs}</pre> {/* Отображаем уже загруженные логи */}
          </div>
        </div>
      )}
    </div>
  );
}

export default BotMonitor;
