let timer: number | null = null;
let enabled = true;

let notificationMinute = 23;

export function setNotificationMinute(minute: number) {
  if (minute < 0) minute = 0;
  if (minute > 59) minute = 59;
  notificationMinute = minute;
}

export function getNextNotificationTime(): Date {
  const now = new Date();
  const next = new Date(now);
  const min = now.getMinutes();
  if (min < notificationMinute) {
    next.setMinutes(notificationMinute, 0, 0);
  } else if (min < (notificationMinute + 30) % 60) {
    next.setMinutes((notificationMinute + 30) % 60, 0, 0);
    if (notificationMinute + 30 >= 60) {
      next.setHours(now.getHours() + 1);
    }
  } else {
    next.setHours(now.getHours() + 1);
    next.setMinutes(notificationMinute, 0, 0);
  }
  return next;
}

export function getMsUntilNextNotification(): number {
  return getNextNotificationTime().getTime() - Date.now();
}

export const startNotificationTimer = (minute?: number): void => {
  if (typeof minute === 'number') setNotificationMinute(minute);
  if (timer !== null) {
    console.log('Notification timer already started.');
    return;
  }

  const scheduleBothNotifications = () => {
    if (!enabled) {
      console.log('Notifications disabled, not scheduling.');
      return;
    }
    const now = new Date();
    const nextSlot = getNextNotificationTime();
    const msUntilSlot = nextSlot.getTime() - now.getTime();
    const msUntilPre = msUntilSlot - 60000; // 1 minute before

    // Schedule pre-notification
    if (msUntilPre > 0) {
      timer = window.setTimeout(() => {
        if (enabled && Notification.permission === 'granted') {
          new Notification("1 minute until optimal water harvest time!");
          console.log('Pre-notification sent.');
        }
        // Schedule main notification at slot
        const msFromNow = nextSlot.getTime() - Date.now();
        timer = window.setTimeout(() => {
          if (enabled && Notification.permission === 'granted') {
            new Notification("It's optimal water harvest time!");
            console.log('Notification sent.');
          }
          // Schedule next cycle
          scheduleBothNotifications();
        }, msFromNow > 0 ? msFromNow : 0);
      }, msUntilPre);
    } else {
      // If less than 1 minute to slot, skip pre, schedule main notification
      timer = window.setTimeout(() => {
        if (enabled && Notification.permission === 'granted') {
          new Notification("It's optimal water harvest time!");
          console.log('Notification sent.');
        }
        // Schedule next cycle
        scheduleBothNotifications();
      }, msUntilSlot > 0 ? msUntilSlot : 0);
    }
  };

  scheduleBothNotifications();
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