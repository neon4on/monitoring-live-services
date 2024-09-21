// src/components/BotMonitor.jsx
import React from 'react';
import './BotMonitor.css';

function BotMonitor({ botName, status, downtimes }) {
  return (
    <div className="bot-monitor">
      <h2>{botName}</h2>
      <p>
        Status: <span className={`status ${status.toLowerCase()}`}>{status}</span>
      </p>
      <p>Downtimes: {downtimes}</p>
    </div>
  );
}

export default BotMonitor;
