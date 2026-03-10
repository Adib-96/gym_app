import { sendNotificationToUser, sendNotificationToUsers } from '@/lib/socket-io-server';
import { createNotification } from '@/lib/notification-service';

/**
 * Trigger when a coach assigns a new workout to a client
 */
export async function sendWorkoutAssignedNotification(
  clientId: string,
  workoutName: string,
  coachName: string
) {
  const notification = createNotification(
    clientId,
    'workout_assigned',
    '💪 New Workout Assigned',
    `${coachName} assigned you "${workoutName}"`,
    { workoutName, coachName },
    '/dashboard/client/workouts'
  );
  sendNotificationToUser(clientId, notification);
}

/**
 * Trigger when a client completes a workout
 */
export async function sendWorkoutCompletedNotification(
  clientId: string,
  coachIds: string[],
  workoutName: string
) {
  const clientNotification = createNotification(
    clientId,
    'workout_completed',
    '✅ Workout Logged',
    `Great! You completed "${workoutName}". Well done!`,
    { workoutName },
    '/dashboard/client'
  );
  sendNotificationToUser(clientId, clientNotification);

  // Notify coaches
  const coachNotification = createNotification(
    coachIds[0],
    'workout_completed',
    '✅ Client Workout Completed',
    `Your client completed "${workoutName}"`,
    { workoutName },
    '/dashboard/coach'
  );
  sendNotificationToUsers(coachIds, coachNotification);
}

/**
 * Trigger when a client hits a progress milestone
 */
export async function sendProgressMilestoneNotification(
  clientId: string,
  milestone: string,
  details: string
) {
  const notification = createNotification(
    clientId,
    'progress_milestone',
    '🏆 Milestone Achieved!',
    `${milestone}: ${details}`,
    { milestone, details },
    '/dashboard/client'
  );
  sendNotificationToUser(clientId, notification);
}

/**
 * Trigger when there's a new message
 */
export async function sendMessageNotification(
  recipientId: string,
  senderName: string,
  messagePreview: string
) {
  const notification = createNotification(
    recipientId,
    'message',
    `💬 New Message from ${senderName}`,
    messagePreview,
    { senderName },
    '/dashboard'
  );
  sendNotificationToUser(recipientId, notification);
}

/**
 * Trigger workout reminder
 */
export async function sendWorkoutReminderNotification(
  clientId: string,
  workoutName: string,
  timeLeft: string
) {
  const notification = createNotification(
    clientId,
    'reminder',
    `⏰ Workout Reminder`,
    `Your "${workoutName}" workout starts in ${timeLeft}`,
    { workoutName, timeLeft },
    '/dashboard/client/workouts'
  );
  sendNotificationToUser(clientId, notification);
}

/**
 * Trigger coach feedback notification
 */
export async function sendCoachFeedbackNotification(
  clientId: string,
  coachName: string,
  feedbackTitle: string
) {
  const notification = createNotification(
    clientId,
    'coach_feedback',
    `👨‍🏫 Feedback from ${coachName}`,
    feedbackTitle,
    { coachName },
    '/dashboard/client'
  );
  sendNotificationToUser(clientId, notification);
}
