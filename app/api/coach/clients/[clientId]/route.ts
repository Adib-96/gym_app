
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { query } from '@/lib/db';
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
        const clientResult = await query(
            `SELECT 
        c.id, 
        u.name, 
        u.email, 
        c.date_of_birth, 
        c.gender,
        c.height,
        c.weight,
        c.fitness_level,
        c.goals,
        c.status,
        c.created_at,
        c.user_id
       FROM clients c
       JOIN users u ON c.user_id = u.id
       WHERE c.id = $1 AND c.coach_id = $2`,
            [clientId, user.userId]
        );

        if (clientResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Client not found or not assigned to you' },
                { status: 404 }
            );
        }

        const client = clientResult.rows[0];

        // Get stats
        const stats = await getClientStats(client.id);

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
        const checkResult = await query(
            `SELECT id FROM clients WHERE id = $1 AND coach_id = $2`,
            [clientId, user.userId]
        );

        if (checkResult.rows.length === 0) {
            return NextResponse.json(
                { error: 'Client not found or not assigned to you' },
                { status: 404 }
            );
        }

        // Update client details
        const updateResult = await query(
            `UPDATE clients 
       SET 
        height = COALESCE($1, height),
        weight = COALESCE($2, weight),
        fitness_level = COALESCE($3, fitness_level),
        goals = COALESCE($4, goals),
        status = COALESCE($5, status),
        updated_at = NOW()
       WHERE id = $6
       RETURNING *`,
            [height, weight, fitness_level, goals, status, clientId]
        );

        return NextResponse.json({
            success: true,
            client: updateResult.rows[0]
        });

    } catch (error) {
        console.error('Error updating client:', error);
        return NextResponse.json(
            { error: 'Failed to update client' },
            { status: 500 }
        );
    }
}
