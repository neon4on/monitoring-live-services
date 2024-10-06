import React, { useState, useEffect } from 'react';
import './BotMonitor.css';

function BotMonitor({ botName }) {
  const [status, setStatus] = useState('Checking...');
  const [downtimes, setDowntimes] = useState(0); // Изначально 0
  const [logs, setLogs] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [initialized, setInitialized] = useState(false);

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

    fetchStatus();
    const interval = setInterval(fetchStatus, 300000); // обновляем каждые 5 минут
    return () => clearInterval(interval);
  }, [initialized]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('https://danya1733.ru/api/bot-logs');
      const data = await response.json();
      const formattedLogs = data.logs.replace(/\\n/g, '\n');
      setLogs(formattedLogs);
      setDowntimes(data.warningCount); // Устанавливаем количество предупреждений
      setShowLogs(true);
    } catch (error) {
      setLogs('Failed to load logs.');
      setShowLogs(true);
    }
  };

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
      {/* Количество предупреждений */}
      <button className="details-button" onClick={fetchLogs}>
        Подробнее
      </button>
      {showLogs && (
        <div className="modal" onClick={() => setShowLogs(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={() => setShowLogs(false)}>
              &times;
            </span>
            <h3>Logs for {botName}</h3>
            <pre className="logs">{logs}</pre> {/* Корректно выводим логи с переносами */}
          </div>
        </div>
      )}
    </div>
  );
}

export default BotMonitor;
