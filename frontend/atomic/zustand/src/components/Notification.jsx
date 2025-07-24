import React, { useEffect } from 'react';
import { useOrderStore } from '../store/useOrderStore';

export const Notification = () => {
    const notification = useOrderStore(state => state.notification);
    const clear = useOrderStore(state => state.clearNotification);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                clear();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [notification, clear]);

    if (!notification) return null;

    return (
        <div className={`notification notification-${notification.type || 'info'}`}>
            {notification.message}
            <button onClick={clear} className="close-btn">
                ×
            </button>
        </div>
    );
};
