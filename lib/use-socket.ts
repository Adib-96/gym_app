'use client';

import { useEffect, useState, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function useSocket(userId?: string) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!userId) return;

    if (!socket) {
      socket = io(undefined, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 10,
      });

      socket.on('connect', () => {
        console.log('Connected to Socket.io');
        setIsConnected(true);
        socket?.emit('join', userId);
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from Socket.io');
        setIsConnected(false);
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
    } else {
      socket.emit('join', userId);
      setIsConnected(socket.connected);
    }

    return () => {
      if (socket) {
        socket.emit('leave', userId);
      }
    };
  }, [userId]);

  return { socket, isConnected };
}

// Subscribe to notifications
export function useNotifications(userId?: string) {
  const [notifications, setNotifications] = useState<any[]>([]);
  const { socket, isConnected } = useSocket(userId);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: any) => {
      setNotifications(prev => [notification, ...prev]);
    };

    socket.on('notification:new', handleNewNotification);

    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, isConnected]);

  const markAsRead = useCallback((notificationId: string) => {
    if (!socket) return;
    setNotifications(prev =>
      prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
    );
    socket.emit('notification:read', { userId, notificationId });
  }, [socket, userId]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return { notifications, markAsRead, clearAll, unreadCount, isConnected };
}
