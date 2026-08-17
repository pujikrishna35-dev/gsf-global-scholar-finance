import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { notificationSoundService } from '../services/notificationSoundService';

const NotificationContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeToast, setActiveToast] = useState(null);

  // Audio Settings State
  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('gsf_notif_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [selectedSound, setSelectedSoundState] = useState(() => {
    return localStorage.getItem('gsf_notif_selected_sound') || 'notification-sound-1';
  });

  const [notificationVolume, setNotificationVolumeState] = useState(() => {
    const saved = localStorage.getItem('gsf_notif_volume');
    return saved !== null ? parseFloat(saved) : 0.7;
  });

  const [newNotifAnim, setNewNotifAnim] = useState(false);

  // Load persisted settings from backend on boot
  useEffect(() => {
    const fetchBackendSettings = async () => {
      try {
        const res = await fetch(`${API_BASE}/settings`);
        const data = await res.json();
        if (data.success && data.data) {
          if (typeof data.data.notificationSoundEnabled === 'boolean') {
            setSoundEnabledState(data.data.notificationSoundEnabled);
            localStorage.setItem('gsf_notif_sound_enabled', JSON.stringify(data.data.notificationSoundEnabled));
          }
          if (data.data.selectedNotificationSound) {
            setSelectedSoundState(data.data.selectedNotificationSound);
            localStorage.setItem('gsf_notif_selected_sound', data.data.selectedNotificationSound);
          }
          if (typeof data.data.notificationVolume === 'number') {
            setNotificationVolumeState(data.data.notificationVolume);
            localStorage.setItem('gsf_notif_volume', data.data.notificationVolume.toString());
          }
        }
      } catch (err) {
        console.warn('Backend settings endpoint offline, using local state.');
      }
    };
    fetchBackendSettings();
  }, []);

  const saveSoundSettings = async (enabled, soundId, volumeVal) => {
    setSoundEnabledState(enabled);
    setSelectedSoundState(soundId);
    setNotificationVolumeState(volumeVal);

    localStorage.setItem('gsf_notif_sound_enabled', JSON.stringify(enabled));
    localStorage.setItem('gsf_notif_selected_sound', soundId);
    localStorage.setItem('gsf_notif_volume', volumeVal.toString());

    try {
      await fetch(`${API_BASE}/settings`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationSoundEnabled: enabled,
          selectedNotificationSound: soundId,
          notificationVolume: volumeVal
        })
      });
    } catch (err) {
      console.warn('Failed to sync settings with backend:', err);
    }
  };

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/notifications`);
      const data = await res.json();
      if (data.success) {
        setNotifications(data.data);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling']
    });

    socket.on('connect', () => {
      console.log('⚡ Connected to Admin Real-Time Socket Server');
    });

    socket.on('new_notification', (notif) => {
      console.log('🔔 Real-Time Notification Received:', notif);
      
      setNotifications((prev) => [notif, ...prev]);
      setUnreadCount((prev) => prev + 1);
      setActiveToast(notif);
      setNewNotifAnim(true);
      setTimeout(() => setNewNotifAnim(false), 2000);

      // Play audio ONLY for NEW_LEAD notifications if sound is enabled
      if (notif.type === 'NEW_LEAD' && soundEnabled) {
        notificationSoundService.playNotificationSound(selectedSound, notificationVolume);
      }

      // Auto hide toast after 6 seconds
      setTimeout(() => {
        setActiveToast((current) => (current?.id === notif.id ? null : current));
      }, 6000);
    });

    return () => {
      socket.disconnect();
    };
  }, [fetchNotifications, soundEnabled, selectedSound, notificationVolume]);

  const markAsRead = async (id) => {
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));

      await fetch(`${API_BASE}/notifications/${id}/read`, {
        method: 'PATCH'
      });
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);

      await fetch(`${API_BASE}/notifications/read-all`, {
        method: 'PATCH'
      });
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  // Triggers sample toast + plays selected sound without affecting DB or unread count
  const triggerTestNotification = () => {
    const sampleToast = {
      id: `test-preview-${Date.now()}`,
      leadId: 'lead-101',
      type: 'NEW_LEAD',
      title: '🔥 New Loan Enquiry',
      studentName: 'Test notification',
      country: 'This is a notification preview.',
      intake: 'Preview',
      classification: 'HOT',
      createdAt: new Date().toISOString()
    };

    setActiveToast(sampleToast);

    if (soundEnabled) {
      notificationSoundService.playNotificationSound(selectedSound, notificationVolume);
    }

    setTimeout(() => {
      setActiveToast((current) => (current?.id === sampleToast.id ? null : current));
    }, 5000);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        soundEnabled,
        selectedSound,
        notificationVolume,
        newNotifAnim,
        saveSoundSettings,
        markAsRead,
        markAllAsRead,
        dismissToast,
        triggerTestNotification,
        fetchNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
