import pm2 from 'pm2';

export function checkBotStatus() {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        console.error('PM2 connection error:', err);
        reject({ status: 'Inactive' });
      }

      pm2.describe('Rush', (err, processDescription) => {
        if (err || !processDescription || processDescription.length === 0) {
          console.error('Error fetching process description:', err);
          resolve({ status: 'Inactive' });
        } else {
          const status = processDescription[0].pm2_env.status;
          if (status === 'online') {
            resolve({ status: 'Active' });
          } else {
            resolve({ status: 'Inactive' });
          }
        }
        pm2.disconnect();
      });
    });
  });
}

export function getBotLogs() {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        console.error('PM2 connection error:', err);
        reject('Error retrieving logs');
      }

      pm2.logs('Rush', (err, logs) => {
        if (err) {
          console.error('Error fetching logs:', err);
          resolve('Error fetching logs');
        } else {
          resolve(logs);
        }
        pm2.disconnect();
      });
    });
  });
}
