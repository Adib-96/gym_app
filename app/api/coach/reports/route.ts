
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { query } from '@/lib/db';

export async function GET(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'coach') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        // 1. Overall Stats for the Coach
        const overallStatsRes = await query(
            `SELECT 
                COUNT(*) as total_assigned,
                COUNT(CASE WHEN w.status = 'completed' THEN 1 END) as total_completed
             FROM workouts w
             JOIN clients c ON w.client_id = c.user_id
             WHERE c.coach_id = $1`,
            [user.userId]
        );

        const totalAssigned = parseInt(overallStatsRes.rows[0].total_assigned) || 0;
        const totalCompleted = parseInt(overallStatsRes.rows[0].total_completed) || 0;
        const overallCompletionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

        // 2. Weekly Stats (Last 7 Days)
        const weeklyStatsRes = await query(
            `SELECT COUNT(*) as count 
             FROM workouts w
             JOIN clients c ON w.client_id = c.user_id
             WHERE c.coach_id = $1 AND w.status = 'completed' AND w.updated_at >= NOW() - INTERVAL '7 days'`,
            [user.userId]
        );
        const weeklyCompleted = parseInt(weeklyStatsRes.rows[0].count) || 0;

        // 3. Breakdown per Client
        const clientBreakdownRes = await query(
            `SELECT 
                u.name,
                COUNT(w.id) as assigned,
                COUNT(CASE WHEN w.status = 'completed' THEN 1 END) as completed,
                CASE 
                    WHEN COUNT(w.id) > 0 THEN ROUND((COUNT(CASE WHEN w.status = 'completed' THEN 1 END)::float / COUNT(w.id)::float) * 100)
                    ELSE 0
                END as rate
             FROM clients c
             JOIN users u ON c.user_id = u.id
             LEFT JOIN workouts w ON c.user_id = w.client_id
             WHERE c.coach_id = $1
             GROUP BY u.name, c.id
             ORDER BY rate DESC`,
            [user.userId]
        );

        return NextResponse.json({
            success: true,
            stats: {
                totalAssigned,
                totalCompleted,
                weeklyCompleted,
                completionRate: overallCompletionRate,
                clientProgress: clientBreakdownRes.rows.map(row => ({
                    name: row.name,
                    assigned: parseInt(row.assigned),
                    completed: parseInt(row.completed),
                    rate: parseInt(row.rate)
                }))
            }
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }
}
