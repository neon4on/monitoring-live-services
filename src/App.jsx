import React from 'react';
import './App.css';
import BotMonitor from './components/BotMonitor';

function App() {
  const services = [{ botName: 'Telegram Bot', status: 'Active', downtimes: 0 }];

  return (
    <div className="App">
      <h1 className="title">Monitoring Dashboard</h1>
      <div
        className="monitor-grid"
        style={{
          gridTemplateColumns: services.length === 1 ? '1fr' : 'repeat(3, 1fr)',
        }}>
        {services.map((service, index) => (
          <BotMonitor key={index} botName={service.botName} />
        ))}
      </div>
    </div>
  );
}

export default App;
