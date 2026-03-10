# Real-Time Notifications System - Implementation Guide

## 🎯 Overview
This is a complete real-time WebSocket notification system integrated with Socket.io for GymTracker. It allows instant notifications for workouts, messages, milestones, and more.

## 📦 What's Been Added

### Files Created:
1. **`lib/notification-service.ts`** - Core notification logic (backend)
2. **`lib/socket-io-server.ts`** - Socket.io server setup
3. **`lib/use-socket.ts`** - React hook for Socket.io (frontend)
4. **`lib/notification-triggers.ts`** - Helper functions to trigger notifications
5. **`components/NotificationCenter.tsx`** - UI component for notifications
6. **`app/api/notifications/route.ts`** - API endpoint for notifications

## 🚀 How to Use

### 1. Add NotificationCenter to Your Dashboard Pages

In any dashboard page (e.g., `app/(frontend_page)/dashboard/client/page.tsx`):

```tsx
'use client';

import { useSession } from 'next-auth/react';
import NotificationCenter from '@/components/NotificationCenter';

export default function ClientDashboard() {
  const { data: session } = useSession();

  return (
    <div>
      {/* Add NotificationCenter to navbar or header */}
      <div className="flex gap-4">
        <NotificationCenter userId={session?.user?.id} />
        {/* Other components */}
      </div>
    </div>
  );
}
```

### 2. Trigger Notifications When Events Happen

#### When Coach Assigns a Workout:
```tsx
import { sendWorkoutAssignedNotification } from '@/lib/notification-triggers';

// In your API route for assigning workouts
await sendWorkoutAssignedNotification(
  clientId,
  'Push Day', 
  'Coach John'
);
```

#### When Client Completes Workout:
```tsx
import { sendWorkoutCompletedNotification } from '@/lib/notification-triggers';

await sendWorkoutCompletedNotification(
  clientId,
  [coachId], // array of coach IDs
  'Leg Day Workout'
);
```

#### When Progress Milestone is Reached:
```tsx
import { sendProgressMilestoneNotification } from '@/lib/notification-triggers';

await sendProgressMilestoneNotification(
  clientId,
  'Weight Loss',
  'Congratulations! You lost 5kg'
);
```

#### When New Message Arrives:
```tsx
import { sendMessageNotification } from '@/lib/notification-triggers';

await sendMessageNotification(
  recipientId,
  'Coach Sarah',
  'Great job on your workout today! Keep it up.'
);
```

#### Scheduled Workout Reminder:
```tsx
import { sendWorkoutReminderNotification } from '@/lib/notification-triggers';

await sendWorkoutReminderNotification(
  clientId,
  'Morning Run',
  '30 minutes'
);
```

#### Coach Feedback:
```tsx
import { sendCoachFeedbackNotification } from '@/lib/notification-triggers';

await sendCoachFeedbackNotification(
  clientId,
  'Coach Mike',
  'Your form has improved significantly!'
);
```

### 3. Example: Update Workout Completion Route

In `app/api/workouts/route.ts`, add notification when workout is marked complete:

```tsx
import { sendWorkoutCompletedNotification } from '@/lib/notification-triggers';

// After marking workout as completed
const completedWorkout = await markWorkoutComplete(workoutId);
await sendWorkoutCompletedNotification(
  userId,
  [coachId],
  completedWorkout.name
);
```

## 🔧 Features

| Feature | Status | Details |
|---------|--------|---------|
| Real-time delivery | ✅ | WebSocket via Socket.io |
| Unread count badge | ✅ | Shows # of unread notifications |
| Read/Unread state | ✅ | Track notification status |
| Multiple types | ✅ | 6 notification types with unique icons |
| Dismissible | ✅ | Clear all or mark individual as read |
| Persistent | ✅ | Notifications stored in memory (upgrade to DB) |
| Connection status | ✅ | Shows if user is connected |

## 📱 Notification Types

1. **💪 Workout Assigned** - Coach assigns a new workout
2. **✅ Workout Completed** - Client completes a workout
3. **🏆 Progress Milestone** - User hits a goal (weight loss, strength gain, etc.)
4. **💬 Message** - New message from coach or client
5. **⏰ Reminder** - Upcoming workout reminder
6. **👨‍🏫 Coach Feedback** - Feedback from coach on form/performance

## 🎨 UI Component Features

```tsx
<NotificationCenter userId={currentUserId} />
```

### What It Provides:
- ✅ Bell icon with unread count badge
- ✅ Real-time notification dropdown
- ✅ Color-coded notifications by type
- ✅ Click to mark as read
- ✅ "Clear All" button
- ✅ Timestamps on notifications
- ✅ Connection status indicator
- ✅ Responsive design

## 🔌 API Endpoints

### GET `/api/notifications`
Get all notifications for current user
```bash
curl http://localhost:3000/api/notifications
```

### GET `/api/notifications?action=unread-count`
Get unread count
```bash
curl http://localhost:3000/api/notifications?action=unread-count
```

### POST `/api/notifications`
Create new notification (triggers real-time delivery)
```bash
curl -X POST http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "user123",
    "type": "workout_assigned",
    "title": "New Workout",
    "message": "Coach assigned Push Day",
    "actionUrl": "/dashboard/workouts"
  }'
```

### PUT `/api/notifications`
Mark notification as read
```bash
curl -X PUT http://localhost:3000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{ "notificationId": "123456" }'
```

## 🔐 Security

- ✅ Authentication required on all endpoints
- ✅ Users only see their own notifications
- ✅ Socket.io validates user in custom 'join' event
- ✅ Notifications scoped to user:userId rooms

## 🚀 Future Enhancements

1. **Database Persistence** - Store notifications in PostgreSQL for historical records
2. **Email Notifications** - Send email for critical notifications
3. **Push Notifications** - Web push for mobile users
4. **Notification Preferences** - Let users opt-in/out of specific types
5. **Notification History** - Archive old notifications
6. **Sound/Visual Alerts** - Browser notifications with audio
7. **Read Receipts** - Track when notifications are read
8. **Smart Batching** - Group similar notifications

## 📊 Testing the System

### 1. Test Real-Time Delivery:
- Open app in two browser windows (different users)
- Generate notification for one user
- See it appear instantly in the other window

### 2. Test WebSocket Connection:
- Open browser DevTools → Network → WS
- Should see `socket.io` WebSocket connection
- Should see connection messages in console

### 3. Test UI Component:
- Click bell icon in NotificationCenter
- Should see all notifications dropdown
- Click to mark as read
- Should see read state change

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Notifications not appearing | Check Socket.io connection in DevTools WS tab |
| "Socket not initialized" error | Ensure user is logged in before mounting NotificationCenter |
| Notifications stuck as unread | Click notification to trigger markAsRead |
| No real-time delivery | Check NEXT_PUBLIC_APP_URL env var matches app URL |

## 📝 Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## ✅ Checklist for Implementation

- [ ] Install socket.io and socket.io-client: `npm install socket.io socket.io-client`
- [ ] Create all 6 new files listed above
- [ ] Add NotificationCenter to your dashboard pages
- [ ] Update API routes to call notification-triggers
- [ ] Test WebSocket connection in DevTools
- [ ] Test real-time notification delivery between users
- [ ] Customize notification types/messages as needed
- [ ] Consider database persistence for production

---

**Status**: ✅ Ready to Use
**Version**: 1.0
**Last Updated**: March 2026
