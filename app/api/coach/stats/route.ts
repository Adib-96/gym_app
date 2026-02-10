
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    if (user.role !== 'coach') {
        return NextResponse.json(
            { error: 'Forbidden' },
            { status: 403 }
        );
    }

    try {
        // 1. Total Clients
        const clientsRes = await query(
            `SELECT count(*) FROM clients WHERE coach_id = $1`,
            [user.userId]
        );

        // 2. Total Active Clients
        const activeClientsRes = await query(
            `SELECT count(*) FROM clients WHERE coach_id = $1 AND status = 'Active'`,
            [user.userId]
        );

        // 3. active workouts (assigned but not completed? or status='active'?)
        // Let's assume 'status' column in workouts table has 'pending', 'completed', etc.
        // We'll count workouts that are 'pending' or 'active' for clients of this coach.
        const activeWorkoutsRes = await query(
            `SELECT count(*) 
         FROM workouts w
         JOIN clients c ON w.client_id = c.id
         WHERE c.coach_id = $1 AND w.status IN ('pending', 'active')`,
            [user.userId]
        );

        // 4. Unread Messages 
        const unreadMessagesRes = await query(
            `SELECT count(*) FROM messages WHERE receiver_id = $1 AND is_read = FALSE`,
            [user.userId]
        );

        // 5. Completion Rate (Simplified: Completed / Total Workouts for these clients)
        // Avoid division by zero
        const workoutStatsRes = await query(
            `SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed
         FROM workouts w
         JOIN clients c ON w.client_id = c.id
         WHERE c.coach_id = $1`,
            [user.userId]
        );

        const totalWorkouts = parseInt(workoutStatsRes.rows[0].total) || 0;
        const completedWorkouts = parseInt(workoutStatsRes.rows[0].completed) || 0;
        const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

        return NextResponse.json({
            success: true,
            stats: {
                totalClients: parseInt(clientsRes.rows[0].count),
                activeClients: parseInt(activeClientsRes.rows[0].count),
                activeWorkouts: parseInt(activeWorkoutsRes.rows[0].count),
                unreadMessages: parseInt(unreadMessagesRes.rows[0].count),
                completionRate: completionRate
            }
        });

    } catch (error) {
        console.error('Error fetching coach stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
