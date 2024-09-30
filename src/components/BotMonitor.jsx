import React, { useState, useEffect } from 'react';
import './BotMonitor.css';

function BotMonitor({ botName }) {
  const [status, setStatus] = useState('Checking...');
  const [downtimes, setDowntimes] = useState(0);
  const [logs, setLogs] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [initialized, setInitialized] = useState(false); // Для отслеживания успешного запроса

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/bot-status');
        const data = await response.json();
        setStatus(data.status);

        if (!initialized) {
          setInitialized(true); // Успешный первый запрос
        } else if (data.status === 'Inactive') {
          setDowntimes((prev) => prev + 1); // Учитываем даунтайм только после инициализации
        }
      } catch (error) {
        if (initialized) {
          setStatus('Inactive');
          setDowntimes((prev) => prev + 1); // Учитываем даунтайм только после инициализации
        }
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 300000);
    return () => clearInterval(interval);
  }, [initialized]);

  const fetchLogs = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bot-logs');
      const data = await response.json();
      setLogs(data.logs);
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
      <p>Downtimes: {downtimes}</p>
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
            <pre className="logs">{logs}</pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default BotMonitor;
