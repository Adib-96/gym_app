import { NextRequest, NextResponse } from 'next/server';
import supabase from '@/lib/supabase-server';
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
        const [
            { data: allUsers, error: usersError },
            { data: coaches, error: coachesError },
            { data: clients, error: clientsError },
            { data: workouts, error: workoutsError }
        ] = await Promise.all([
            supabase.from('users').select('id', { count: 'exact' }),
            supabase.from('users').select('id', { count: 'exact' }).eq('role', 'coach'),
            supabase.from('users').select('id', { count: 'exact' }).eq('role', 'user'),
            supabase.from('workouts').select('id', { count: 'exact' })
        ]);

        if (usersError || coachesError || clientsError || workoutsError) {
            throw new Error('Error fetching stats');
        }

        const stats = {
            totalUsers: allUsers?.length || 0,
            totalCoaches: coaches?.length || 0,
            totalClients: clients?.length || 0,
            totalWorkouts: workouts?.length || 0,
            // Placeholder for revenue/subscriptions if implemented
            revenue: 0,
            activeSubscriptions: 0
        };

        return NextResponse.json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('❌ Admin Stats Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
