let timer: number | null = null;
let enabled = true;

export function getNextNotificationTime(): Date {
  const now = new Date();
  const next = new Date(now);
  const min = now.getMinutes();
  if (min < 23) {
    next.setMinutes(23, 0, 0);
  } else if (min < 53) {
    next.setMinutes(53, 0, 0);
  } else {
    next.setHours(now.getHours() + 1, 23, 0, 0);
  }
  return next;
}

export function getMsUntilNextNotification(): number {
  return getNextNotificationTime().getTime() - Date.now();
}

export const startNotificationTimer = (): void => {
  if (timer !== null) {
    console.log('Notification timer already started.');
    return;
  }

  const getMsUntilNextSlot = () => {
    const now = new Date();
    const next = new Date(now);
    // Get current minutes
    const min = now.getMinutes();
    if (min < 23) {
      next.setMinutes(23, 0, 0);
    } else if (min < 53) {
      next.setMinutes(53, 0, 0);
    } else {
      // Next slot is at :23 of the next hour
      next.setHours(now.getHours() + 1, 23, 0, 0);
    }
    return next.getTime() - now.getTime();
  };

  const scheduleNotification = () => {
    if (enabled && Notification.permission === 'granted') {
      new Notification("It's optimal water harvest time!");
      console.log('Notification sent.');
    } else {
      console.log('Notification disabled or permission not granted.');
    }
    timer = window.setTimeout(scheduleNotification, 30 * 60 * 1000); // Always 30 min to next slot
  };

  // Schedule first notification at the next slot (:23 or :53)
  const msUntilNext = getMsUntilNextSlot();
  console.log(`First notification in ${msUntilNext / 1000} seconds.`);
  timer = window.setTimeout(scheduleNotification, msUntilNext);
};

export const stopNotificationTimer = (): void => {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
    console.log('Notification timer stopped.');
  } else {
    console.log('Notification timer was not running.');
  }
};

export const enableNotifications = (): void => {
  enabled = true;
  if (Notification.permission !== 'granted') {
    Notification.requestPermission().then((permission) => {
      if (permission !== 'granted') {
        enabled = false;
        alert('Notifications are blocked by the browser. Please allow notifications.');
      }
    });
  }
  console.log('Notifications enabled.');
};

export const disableNotifications = (): void => {
  enabled = false;
  console.log('Notifications disabled.');
};