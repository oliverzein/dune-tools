import * as notifier from 'node-notifier';

let timer: NodeJS.Timeout | null = null;
let enabled = true;

export const startNotificationTimer = (): void => {
  if (timer !== null) {
    console.log('Notification timer already started.');
    return;
  }

  const scheduleNotification = () => {
    if (enabled) {
      notifier.notify('It\'s optimal water harvest time!');
      console.log('Notification sent.');
    } else {
      console.log('Notification disabled.');
    }
    timer = setTimeout(scheduleNotification, 30 * 60 * 1000); // Schedule next notification in 30 minutes
  };

  const now = new Date();
  const initialNotificationTime = new Date(now);
  initialNotificationTime.setHours(10, 53, 0, 0);

  // If 10:53:00 has already passed today, schedule for tomorrow
  if (now > initialNotificationTime) {
    initialNotificationTime.setDate(initialNotificationTime.getDate() + 1);
  }

  const timeUntilFirstNotification = initialNotificationTime.getTime() - now.getTime();

  console.log(`Scheduling first notification in ${timeUntilFirstNotification / 1000} seconds.`);
  timer = setTimeout(() => {
    scheduleNotification();
  }, timeUntilFirstNotification);
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
  console.log('Notifications enabled.');
}

export const disableNotifications = (): void => {
  enabled = false;
  console.log('Notifications disabled.');
}