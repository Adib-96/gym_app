'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/lib/use-socket';
import { X, Bell } from 'lucide-react';

interface NotificationCenterProps {
  userId?: string;
}

export default function NotificationCenter({ userId }: NotificationCenterProps) {
  const { notifications, markAsRead, clearAll, unreadCount, isConnected } = useNotifications(userId);
  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      workout_assigned: '💪',
      workout_completed: '✅',
      message: '💬',
      progress_milestone: '🏆',
      reminder: '⏰',
      coach_feedback: '👨‍🏫',
    };
    return icons[type] || '🔔';
  };

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      workout_assigned: 'bg-blue-50 border-l-4 border-blue-500',
      workout_completed: 'bg-green-50 border-l-4 border-green-500',
      message: 'bg-purple-50 border-l-4 border-purple-500',
      progress_milestone: 'bg-yellow-50 border-l-4 border-yellow-500',
      reminder: 'bg-orange-50 border-l-4 border-orange-500',
      coach_feedback: 'bg-indigo-50 border-l-4 border-indigo-500',
    };
    return colors[type] || 'bg-gray-50 border-l-4 border-gray-500';
  };

  return (
    <div className="relative">
      {/* Bell Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
        {!isConnected && (
          <span className="absolute bottom-0 right-0 w-2 h-2 bg-gray-400 rounded-full"></span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl z-50 max-h-96 overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={clearAll}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear All
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 ${getNotificationColor(notification.type)} ${
                    !notification.read ? 'bg-opacity-100' : 'opacity-75'
                  } cursor-pointer hover:bg-opacity-100 transition-all`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-3">
                    <span className="text-2xl flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">
                        {notification.title}
                      </p>
                      <p className="text-gray-600 text-xs mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      <p className="text-gray-400 text-xs mt-2">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
