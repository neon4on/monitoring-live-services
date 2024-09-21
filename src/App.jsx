// src/App.jsx
import React from 'react';
import './App.css';
import BotMonitor from './components/BotMonitor';

function App() {
  return (
    <div className="App">
      <h1 className="title">Monitoring Dashboard</h1>
      <div className="monitor-grid">
        <BotMonitor botName="Telegram Bot" status="Active" downtimes={0} />
        <BotMonitor botName="Service" status="Inactive" downtimes={99} />
        <BotMonitor botName="Service" status="Inactive" downtimes={99} />
      </div>
    </div>
  );
}

export default App;
