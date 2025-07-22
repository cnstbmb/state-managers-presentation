import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import { notificationAtom } from '../atoms/uiAtoms';

export const Notification = () => {
    const [notification, setNotification] = useAtom(notificationAtom);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [notification, setNotification]);

    if (!notification) return null;

    return (
        <div className={`notification notification-${notification.type || 'info'}`}>
            {notification.message}
            <button onClick={() => setNotification(null)} className="close-btn">
                ×
            </button>
        </div>
    );
};
