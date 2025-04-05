export async function askNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('Les notifications ne sont pas supportées par ce navigateur.');
      return false;
    }
  
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  export function sendNotification(title: string, options?: NotificationOptions) {
    if (!('Notification' in window)) {
      console.log('Les notifications ne sont pas supportées par ce navigateur.');
      return;
    }
  
    if (Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
  