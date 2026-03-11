// Example: How to integrate NotificationCenter into your Dashboard
// This shows the pattern for any dashboard page

'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import NotificationCenter from '@/components/NotificationCenter';
import { sendWorkoutAssignedNotification } from '@/lib/notification-triggers';

/**
 * USAGE EXAMPLE: Add NotificationCenter to any dashboard page
 * 
 * 1. Import NotificationCenter component
 * 2. Get user ID from session
 * 3. Add <NotificationCenter userId={userId} /> to your header/navbar
 */

export function DashboardHeader() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const userId = (session?.user as any)?.userId;

  // Example: Trigger a test notification
  const handleTestNotification = async () => {
    if (!userId) return;
    setIsLoading(true);
    try {
      await sendWorkoutAssignedNotification(
        userId,
        'Test Workout - Push Day',
        'Admin'
      );
      console.log('✅ Test notification sent!');
    } catch (error) {
      console.error('❌ Failed to send notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-4">
        {/* Add NotificationCenter here */}
        {userId && (
          <NotificationCenter userId={userId} />
        )}
        {/* Test Button (remove in production) */}
        <button
          onClick={handleTestNotification}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Sending...' : 'Test Notification'}
        </button>
      </div>
    </div>
  );
}

/**
 * INTEGRATION PATTERNS
 * 
 * Pattern 1: Add to existing Layout
 * ================================
 * In app/(frontend_page)/dashboard/layout.tsx:
 * 
 * export default function DashboardLayout({ children }) {
 *   const { data: session } = useSession();
 *   return (
 *     <div>
 *       <header className="flex justify-between items-center">
 *         <h1>GymTracker</h1>
 *         <NotificationCenter userId={session?.user?.id} />
 *       </header>
 *       {children}
 *     </div>
 *   );
 * }
 * 
 * Pattern 2: Add to Navbar Component
 * ====================================
 * In components/Navbar.tsx, add:
 * 
 * <NotificationCenter userId={userId} />
 * 
 * Pattern 3: Add to Custom Header Component
 * ===========================================
 * Create components/DashboardHeader.tsx:
 * 
 * function DashboardHeader({ userId }) {
 *   return (
 *     <div className="flex justify-between">
 *       <Logo />
 *       <NotificationCenter userId={userId} />
 *       <UserMenu />
 *     </div>
 *   );
 * }
 */

/**
 * TRIGGERING NOTIFICATIONS FROM YOUR API ROUTES
 * 
 * Example 1: When workout is assigned
 * =====================================
 * In app/api/workouts/create/route.ts:
 * 
 * import { sendWorkoutAssignedNotification } from '@/lib/notification-triggers';
 * 
 * export async function POST(request: NextRequest) {
 *   // ... create workout logic ...
 *   
 *   // Send notification to client
 *   await sendWorkoutAssignedNotification(
 *     clientId,
 *     workoutName,
 *     coachName
 *   );
 *   
 *   return NextResponse.json({ success: true });
 * }
 * 
 * Example 2: When client completes workout
 * ==========================================
 * In app/api/workouts/sessions/[sessionId]/route.ts:
 * 
 * import { sendWorkoutCompletedNotification } from '@/lib/notification-triggers';
 * 
 * export async function PUT(request: NextRequest) {
 *   // ... mark workout as complete ...
 *   
 *   // Notify client and coaches
 *   await sendWorkoutCompletedNotification(
 *     clientId,
 *     [coachId],
 *     workoutName
 *   );
 *   
 *   return NextResponse.json({ success: true });
 * }
 * 
 * Example 3: When progress milestone is reached
 * ===============================================
 * import { sendProgressMilestoneNotification } from '@/lib/notification-triggers';
 * 
 * // In your progress calculation logic
 * if (weightLoss >= 5) {
 *   await sendProgressMilestoneNotification(
 *     userId,
 *     '5kg Weight Loss',
 *     'Congratulations! You reached your 5kg weight loss goal!'
 *   );
 * }
 */

export default DashboardHeader;
