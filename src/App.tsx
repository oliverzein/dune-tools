import React, { useState } from 'react';
import './App.css';
import { startNotificationTimer, stopNotificationTimer, enableNotifications, disableNotifications, getNextNotificationTime, getMsUntilNextNotification } from './notifier';

function App() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [nextTime, setNextTime] = useState<Date | null>(null);
  const [msLeft, setMsLeft] = useState<number>(0);

  // Update countdown every second when enabled
  React.useEffect(() => {
    let interval: number | undefined;
    if (notificationsEnabled) {
      const update = () => {
        setNextTime(getNextNotificationTime());
        setMsLeft(getMsUntilNextNotification());
      };
      update();
      interval = window.setInterval(update, 1000);
    } else {
      setNextTime(null);
      setMsLeft(0);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [notificationsEnabled]);

  const handleToggleNotifications = () => {
    if (!notificationsEnabled) {
      enableNotifications();
      startNotificationTimer();
    } else {
      disableNotifications();
      stopNotificationTimer();
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      <h2>Water Harvest Notifier</h2>
      <button
        style={{
          padding: '1em 2em',
          fontSize: '1.1em',
          borderRadius: 8,
          background: notificationsEnabled ? '#ff5555' : '#4caf50',
          color: '#fff',
          border: 'none',
          marginBottom: '1em',
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}
        onClick={handleToggleNotifications}
      >
        {notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications'}
      </button>
      <br />
      <button
        style={{
          padding: '0.7em 1.5em',
          fontSize: '10px',
          borderRadius: 8,
          background: '#2196f3',
          color: '#fff',
          border: 'none',
          marginBottom: '1em',
          cursor: 'pointer',
          marginTop: '0.5em',
          transition: 'background 0.2s',
        }}
        onClick={() => {
          if (Notification.permission !== 'granted') {
            Notification.requestPermission().then((permission) => {
              if (permission === 'granted') {
                new Notification('This is a test notification!');
              } else {
                alert('Please allow notifications in your browser to test.');
              }
            });
          } else {
            new Notification('This is a test notification!');
          }
        }}
      >
        Show Test Notification
      </button>
      <div style={{ marginTop: '1em', fontSize: '1em', color: notificationsEnabled ? '#4caf50' : '#888' }}>
        Notifications are <b>{notificationsEnabled ? 'ENABLED' : 'DISABLED'}</b>.
      </div>
      {notificationsEnabled && (
        <div style={{ marginTop: '0.7em', fontSize: '1em', color: '#fff' }}>
          <div>
            Next notification at: <b>{nextTime ? nextTime.toLocaleTimeString() : '...'}</b>
          </div>
          <div>
            Time left: <b>{formatMs(msLeft)}</b>
          </div>
        </div>
      )}

    </div>
  );
}

function formatMs(ms: number): string {
  if (ms == null || isNaN(ms)) return '...';
  if (ms <= 0) return 'now';
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

export default App;
