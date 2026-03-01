import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { authenticateRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        const { user, error } = await authenticateRequest(request);

        if (error || !user) {
            return NextResponse.json({ error: error || 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch system stats
        const statsResult = await Promise.all([
            query('SELECT COUNT(*) as total FROM users'),
            query("SELECT COUNT(*) as total FROM users WHERE role = 'coach'"),
            query("SELECT COUNT(*) as total FROM users WHERE role = 'user'"),
            query('SELECT COUNT(*) as total FROM workouts'),
        ]);
        const stats = {
            totalUsers: parseInt(statsResult[0].rows[0].total),
            totalCoaches: parseInt(statsResult[1].rows[0].total),
            totalClients: parseInt(statsResult[2].rows[0].total),
            totalWorkouts: parseInt(statsResult[3].rows[0].total),
            // Placeholder for revenue/subscriptions if implemented
            revenue: 0,
            activeSubscriptions: 0
        };
        return NextResponse.json({
            success: true,
            stats
        });

    } catch (error: any) {
        console.error('❌ Admin Stats Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
