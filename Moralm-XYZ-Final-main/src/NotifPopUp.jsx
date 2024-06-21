import React, { useState, useEffect } from 'react';
import './NotifPopUp.css';
import { deleteNotificationById, deleteAllNotifications } from './apiService'; // Import the API functions

const NotificationsModal = ({ isActive, onClose, notifications, onNotificationClose, onClearAllNotifications }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isActive) {
            setIsAnimating(true);
        }
    }, [isActive]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 300); // Match the duration of the slide-out animation
    };

    const handleDeleteNotification = async (id) => {
        try {
            await deleteNotificationById(id);
            onNotificationClose(id);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleClearAll = async () => {
        try {
            await deleteAllNotifications();
            onClearAllNotifications();
        } catch (error) {
            console.error('Error clearing all notifications:', error);
        }
    };

    if (!isActive && !isAnimating) return null;

    return (
        <div className={`notif-popup-overlay ${isAnimating ? 'fade-in' : 'fade-out'}`} onClick={handleClose}>
            <div className={`notif-popup-content ${isAnimating ? 'slide-in' : 'slide-out'}`} onClick={(e) => e.stopPropagation()}>
                <div className="notif-popup-header">
                    <h2>All Notifications</h2>
                    <div className="notif-popup-header-buttons">
                        {notifications.length > 0 && (
                            <button className="notif-popup-clear-all" onClick={handleClearAll}>Clear All</button>
                        )}
                        <button className="notif-popup-close-button" onClick={handleClose}>×</button>
                    </div>
                </div>
                <div className="notif-popup-body">
                    {notifications.length === 0 ? (
                        <div className="notif-popup-no-notifications">You have no notifications!</div>
                    ) : (
                        notifications.map((notification) => (
                            <div key={notification.id} className="notif-popup-notification-item">
                                <div className="notif-popup-notification-title">{notification.title}</div>
                                <div className="notif-popup-notification-message">{notification.message}</div>
                                <button className="notif-popup-close-notification" onClick={() => handleDeleteNotification(notification.id)}>×</button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsModal;
