// Notification Service - Backend
export type NotificationType = 'workout_assigned' | 'workout_completed' | 'message' | 'progress_milestone' | 'reminder' | 'coach_feedback';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// In-memory notification storage (replace with DB in production)
const notifications = new Map<string, Notification[]>();

export function createNotification(
  userId: string,
  type: NotificationType,
  title: string,
  message: string,
  data?: any,
  actionUrl?: string
): Notification {
  const notification: Notification = {
    id: Date.now().toString(),
    userId,
    type,
    title,
    message,
    data,
    read: false,
    createdAt: new Date(),
    actionUrl,
  };

  if (!notifications.has(userId)) {
    notifications.set(userId, []);
  }
  notifications.get(userId)!.unshift(notification);

  return notification;
}

export function getUserNotifications(userId: string): Notification[] {
  return notifications.get(userId) || [];
}

export function markAsRead(userId: string, notificationId: string): boolean {
  const userNotifications = notifications.get(userId);
  if (!userNotifications) return false;

  const notification = userNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.read = true;
    return true;
  }
  return false;
}

export function getUnreadCount(userId: string): number {
  const userNotifications = notifications.get(userId) || [];
  return userNotifications.filter(n => !n.read).length;
}
