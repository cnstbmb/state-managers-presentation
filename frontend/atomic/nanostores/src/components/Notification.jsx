import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { notificationAtom } from '../stores/uiStores';

export const Notification = () => {
    const notification = useStore(notificationAtom);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                notificationAtom.set(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [notification]);

    if (!notification) return null;

    return (
        <div className={`notification notification-${notification.type || 'info'}`}>
            {notification.message}
            <button onClick={() => notificationAtom.set(null)} className="close-btn">
                ×
            </button>
        </div>
    );
};
