import React, { useEffect } from 'react';
import { useOrdersState } from '../hooks/useOrderSelectors';
import { useOrderActions } from '../hooks/useOrderActions';

export const Notification = () => {
    const { notification } = useOrdersState();
    const { clearNotification } = useOrderActions();

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                clearNotification();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [notification, clearNotification]);

    if (!notification) return null;

    return (
        <div className={`notification notification-${notification.type || 'info'}`}>
            {notification.message}
            <button onClick={clearNotification} className="close-btn">
                ×
            </button>
        </div>
    );
};
