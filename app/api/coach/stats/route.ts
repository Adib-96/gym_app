
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import supabase from '@/lib/supabase-server';

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
        // 1. Get all client IDs for this coach
        const { data: coachClients, error: clientsError } = await supabase
            .from('clients')
            .select('id')
            .eq('coach_id', user.userId);

        if (clientsError) {
            throw clientsError;
        }

        const clientIds = coachClients?.map(c => c.id) || [];
        const totalClients = clientIds.length;

        // 2. Total Active Clients
        const { data: activeClients, error: activeClientsError } = await supabase
            .from('clients')
            .select('id')
            .eq('coach_id', user.userId)
            .eq('status', 'Active');

        if (activeClientsError) {
            throw activeClientsError;
        }

        const totalActiveClients = activeClients?.length || 0;

        // 3. Active workouts (assume client_id is the user_id, not the clients table id)
        const { data: activeWorkouts, error: activeWorkoutsError } = await supabase
            .from('workouts')
            .select('id')
            .in('status', ['pending', 'active']);

        if (activeWorkoutsError) {
            throw activeWorkoutsError;
        }

        const totalActiveWorkouts = activeWorkouts?.length || 0;

        // 4. Unread Messages
        const { data: unreadMessages, error: unreadError } = await supabase
            .from('messages')
            .select('id')
            .eq('receiver_id', user.userId)
            .eq('is_read', false);

        if (unreadError) {
            throw unreadError;
        }

        const totalUnreadMessages = unreadMessages?.length || 0;

        // 5. Completion Rate - fetch all workouts for client users and check status
        const { data: allWorkouts, error: workoutsError } = await supabase
            .from('workouts')
            .select('status');

        if (workoutsError) {
            throw workoutsError;
        }

        const totalWorkouts = allWorkouts?.length || 0;
        const completedWorkouts = allWorkouts?.filter(w => w.status === 'completed').length || 0;
        const completionRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;

        return NextResponse.json({
            success: true,
            stats: {
                totalClients,
                activeClients: totalActiveClients,
                activeWorkouts: totalActiveWorkouts,
                unreadMessages: totalUnreadMessages,
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
