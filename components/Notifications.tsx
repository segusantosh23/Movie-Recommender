import React, { useContext } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

const Notifications: React.FC = () => {
  const context = useContext(NotificationContext);

  // If context is not available, render nothing. This could happen if the component
  // is rendered outside of the NotificationProvider.
  if (!context) {
    return null;
  }
  
  const { notifications } = context;
  
  return (
    <div className="fixed bottom-4 right-4 z-[100] w-auto max-w-sm space-y-3">
      {notifications.map(notification => (
        <div
          key={notification.id}
          className="toast-enter bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-semibold py-3 px-6 rounded-xl shadow-2xl"
          role="alert"
        >
          <p>{notification.message}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;