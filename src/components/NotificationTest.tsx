// src/components/NotificationTest.tsx

import { askNotificationPermission, sendNotification } from '../utils/notification';

export default function NotificationTest() {
  const handleClick = async () => {
    const permissionGranted = await askNotificationPermission();
    if (permissionGranted) {
      sendNotification('Le système n\'attend pas, Level UP !', {
        body: 'Allez, booste ton niveau !',
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700"
      >
        Tester Notification
      </button>
    </div>
  );
}
