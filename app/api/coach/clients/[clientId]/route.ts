
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import supabase from '@/lib/supabase-server';
import { getClientStats } from '@/lib/workouts-service';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ clientId: string }> }
) {
    const { user, error } = await authenticateRequest(request);
    const { clientId } = await params;

    if (error || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    // Only coaches can access this
    if (user.role !== 'coach') {
        return NextResponse.json(
            { error: 'Only coaches can access client details' },
            { status: 403 }
        );
    }

    try {
        // Get client details
        const { data: clientData, error: supabaseError } = await supabase
            .from('clients')
            .select('id, user_id, date_of_birth, gender, height, weight, fitness_level, goals, status, created_at')
            .eq('id', clientId)
            .eq('coach_id', user.userId)
            .maybeSingle();

        if (supabaseError) {
            throw supabaseError;
        }

        if (!clientData) {
            return NextResponse.json(
                { error: 'Client not found or not assigned to you' },
                { status: 404 }
            );
        }

        // Fetch user details separately
        const { data: userData, error: userError } = await supabase
            .from('users')
            .select('id, name, email')
            .eq('id', clientData.user_id)
            .maybeSingle();

        if (userError) {
            throw userError;
        }

        const client = {
            id: clientData.id,
            name: userData?.name || 'Unknown',
            email: userData?.email || 'Unknown',
            date_of_birth: clientData.date_of_birth,
            gender: clientData.gender,
            height: clientData.height,
            weight: clientData.weight,
            fitness_level: clientData.fitness_level,
            goals: clientData.goals,
            status: clientData.status,
            created_at: clientData.created_at,
            user_id: clientData.user_id
        };

        // Get stats - pass the user_id, not the client id
        const stats = await getClientStats(clientData.user_id);

        return NextResponse.json({
            success: true,
            client: {
                ...client,
                stats
            }
        });

    } catch (error) {
        console.error('Error fetching client details:', error);
        return NextResponse.json(
            { error: 'Failed to fetch client details' },
            { status: 500 }
        );
    }
}


export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ clientId: string }> }
) {
    const { user, error } = await authenticateRequest(request);
    const { clientId } = await params;

    if (error || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    if (user.role !== 'coach') {
        return NextResponse.json(
            { error: 'Only coaches can update client details' },
            { status: 403 }
        );
    }

    try {
        const body = await request.json();
        const { height, weight, fitness_level, goals, status } = body;

        // Verify ownership
        const { data: checkResult, error: checkError } = await supabase
            .from('clients')
            .select('id')
            .eq('id', clientId)
            .eq('coach_id', user.userId)
            .maybeSingle();

        if (checkError) {
            throw checkError;
        }

        if (!checkResult) {
            return NextResponse.json(
                { error: 'Client not found or not assigned to you' },
                { status: 404 }
            );
        }

        // Update client details
        const { data: updatedClient, error: updateError } = await supabase
            .from('clients')
            .update({
                height: height !== undefined ? height : undefined,
                weight: weight !== undefined ? weight : undefined,
                fitness_level: fitness_level !== undefined ? fitness_level : undefined,
                goals: goals !== undefined ? goals : undefined,
                status: status !== undefined ? status : undefined
            })
            .eq('id', clientId)
            .select('*')
            .single();

        if (updateError) {
            throw updateError;
        }

        return NextResponse.json({
            success: true,
            client: updatedClient
        });

    } catch (error) {
        console.error('Error updating client:', error);
        return NextResponse.json(
            { error: 'Failed to update client' },
            { status: 500 }
        );
    }
}
