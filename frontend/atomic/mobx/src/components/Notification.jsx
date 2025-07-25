import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useOrderStore } from '../hooks/useOrderStore';

export const Notification = observer(() => {
    const store = useOrderStore();
    const notification = store.notification;
    const clear = store.clearNotification.bind(store);

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
});
