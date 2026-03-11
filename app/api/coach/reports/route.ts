
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import supabase from '@/lib/supabase-server';

export async function GET(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (user.role !== 'coach') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    try {
        // Get all clients for this coach
        const { data: clients, error: clientsError } = await supabase
            .from('clients')
            .select('id, user_id')
            .eq('coach_id', user.userId);

        if (clientsError) {
            throw clientsError;
        }

        const clientIds = clients?.map(c => c.id) || [];
        const userIds = clients?.map(c => c.user_id) || [];

        // Get all workouts for these clients
        const { data: allWorkouts, error: workoutsError } = await supabase
            .from('workouts')
            .select('id, client_id, status')
            .in('client_id', userIds);

        if (workoutsError) {
            throw workoutsError;
        }

        // Calculate overall stats
        const totalAssigned = allWorkouts?.length || 0;
        const totalCompleted = allWorkouts?.filter(w => w.status === 'completed').length || 0;
        const overallCompletionRate = totalAssigned > 0 ? Math.round((totalCompleted / totalAssigned) * 100) : 0;

        // Get weekly completed workouts
        const { data: weeklyWorkouts, error: weeklyError } = await supabase
            .from('workouts')
            .select('id')
            .in('client_id', userIds)
            .eq('status', 'completed')
            .gte('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (weeklyError) {
            throw weeklyError;
        }

        const weeklyCompleted = weeklyWorkouts?.length || 0;

        // Get breakdown per client
        const { data: clientsWithUsers, error: detailsError } = await supabase
            .from('clients')
            .select('id, user_id')
            .eq('coach_id', user.userId);

        if (detailsError) {
            throw detailsError;
        }

        // Fetch user names separately
        const clientUserIds = clientsWithUsers?.map(c => c.user_id).filter(Boolean) || [];
        let userMap: { [key: string]: { name: string } } = {};
        
        if (clientUserIds.length > 0) {
          const { data: users, error: usersError } = await supabase
            .from('users')
            .select('id, name')
            .in('id', clientUserIds);

          if (usersError) {
            throw usersError;
          }

          userMap = (users || []).reduce((map, u) => {
            map[u.id] = { name: u.name };
            return map;
          }, {});
        }

        const clientProgress = await Promise.all(
            (clientsWithUsers || []).map(async (client) => {
                const { data: workouts } = await supabase
                    .from('workouts')
                    .select('id, status')
                    .eq('client_id', client.user_id);

                const assigned = workouts?.length || 0;
                const completed = workouts?.filter(w => w.status === 'completed').length || 0;
                const rate = assigned > 0 ? Math.round((completed / assigned) * 100) : 0;

                return {
                    name: userMap[client.user_id]?.name || 'Unknown',
                    assigned,
                    completed,
                    rate
                };
            })
        );

        return NextResponse.json({
            success: true,
            stats: {
                totalAssigned,
                totalCompleted,
                weeklyCompleted,
                completionRate: overallCompletionRate,
                clientProgress: clientProgress.sort((a, b) => b.rate - a.rate)
            }
        });

    } catch (error) {
        console.error('Error fetching reports:', error);
        return NextResponse.json({ error: 'Failed to fetch report data' }, { status: 500 });
    }
}
