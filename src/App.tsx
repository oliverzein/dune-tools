import React, { useState } from 'react';
import './App.css';
import { startNotificationTimer, stopNotificationTimer, enableNotifications, disableNotifications, getNextNotificationTime, getMsUntilNextNotification } from './notifier';

function App() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [nextTime, setNextTime] = useState<Date | null>(null);
  const [msLeft, setMsLeft] = useState<number>(0);
  const [notifMinute, setNotifMinute] = useState<number>(23);

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
      startNotificationTimer(notifMinute);
    } else {
      disableNotifications();
      stopNotificationTimer();
    }
    setNotificationsEnabled(!notificationsEnabled);
  };

  // Update notifier minute when changed
  React.useEffect(() => {
    if (notificationsEnabled) {
      stopNotificationTimer();
      startNotificationTimer(notifMinute);
    }
    // eslint-disable-next-line
  }, [notifMinute]);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center' }}>
      <h2>Water Harvest Notifier</h2>
      <div style={{ marginBottom: '1em' }}>
        <label htmlFor="minute-input">Notification minute (0-59): </label>
        <input
          id="minute-input"
          type="number"
          min={0}
          max={59}
          value={notifMinute}
          onChange={e => {
            let v = parseInt(e.target.value, 10);
            if (isNaN(v) || v < 0) v = 0;
            if (v > 59) v = 59;
            setNotifMinute(v);
          }}
          style={{ width: 60, fontSize: '1em', padding: '0.2em', borderRadius: 4, border: '1px solid #aaa' }}
          disabled={notificationsEnabled}
        />
      </div>
      <div style={{ marginBottom: '2em' }}>
        <label style={{ fontSize: '1em', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={notificationsEnabled}
            onChange={handleToggleNotifications}
            style={{ marginRight: 8, transform: 'scale(1.4)', verticalAlign: 'middle' }}
          />
          Notifications Enabled
        </label>
      </div>
      {notificationsEnabled && (
        <>
          <div style={{ marginTop: '0.1em', fontSize: '1em', color: '#fff' }}>
            <div>
              Next notification at: <b>{nextTime ? nextTime.toLocaleTimeString() : '...'}</b>
            </div>
          </div>
          <ProgressBar msLeft={msLeft} notifMinute={notifMinute} />
        </>
      )}

      <button
        style={{
          padding: '0.7em 1.5em',
          fontSize: '10px',
          borderRadius: 8,
          background: '#2196f3',
          color: '#fff',
          border: 'none',
          marginTop: '2em',
          cursor: 'pointer',
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
    </div>
  );
}

function ProgressBar({ msLeft, notifMinute }: { msLeft: number, notifMinute: number }) {
  // Calculate total interval in ms (always 30 min)
  const totalMs = 30 * 60 * 1000;
  let percent = Math.max(0, Math.min(1, msLeft / totalMs));
  const timeLabel = formatMs(msLeft);
  return (
    <div style={{
      margin: '0.5em 0',
      height: 24,
      width: '100%',
      background: '#333',
      borderRadius: 12,
      overflow: 'hidden',
      boxShadow: '0 1px 3px #0003',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 500,
      fontSize: 16,
      color: percent > 0.5 ? '#fff' : '#222',
      letterSpacing: 1,
    }}>
      <div style={{
        height: '100%',
        width: `${percent * 100}%`,
        background: '#4caf50',
        transition: 'width 0.5s',
        borderRadius: 12,
        position: 'absolute',
        left: 0,
        top: 0,
        zIndex: 1,
      }} />
      <span style={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        textAlign: 'center',
        userSelect: 'none',
        pointerEvents: 'none',
        mixBlendMode: percent > 0.5 ? 'normal' : 'difference',
      }}>{timeLabel}</span>
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
