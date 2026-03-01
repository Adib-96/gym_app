
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import pool from '@/lib/db';

export async function POST(request: NextRequest) {
    const { user, error } = await authenticateRequest(request);

    if (error || !user) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    if (user.role !== 'coach') {
        return NextResponse.json(
            { error: 'Only coaches can create workouts' },
            { status: 403 }
        );
    }

    // Use a dedicated client for transaction
    const client = await pool.connect();

    try {
        const body = await request.json();
        const { clientId, name, description, scheduledDate, exercises } = body;

        // Validate input
        if (!clientId || !name || !exercises || !Array.isArray(exercises) || exercises.length === 0) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await client.query('BEGIN');

        // Verify client belongs to coach
        const clientCheck = await client.query(
            `SELECT user_id FROM clients WHERE id = $1 AND coach_id = $2`,
            [clientId, user.userId]
        );

        if (clientCheck.rows.length === 0) {
            await client.query('ROLLBACK');
            return NextResponse.json(
                { error: 'Client not found or not assigned to you' },
                { status: 404 }
            );
        }

        const validClientId = clientCheck.rows[0].user_id;

        // Create Workout
        const workoutResult = await client.query(
            `INSERT INTO workouts (client_id, name, description, status, assigned_date, scheduled_date, total_duration)
       VALUES ($1, $2, $3, 'pending', NOW(), $4, 0)
       RETURNING id`,
            [validClientId, name, description || '', scheduledDate || null]
        );

        const workoutId = workoutResult.rows[0].id;
        let totalDuration = 0;

        // Insert Exercises
        for (let i = 0; i < exercises.length; i++) {
            const ex = exercises[i];

            // Calculate estimated duration (2 min per set + 1 min rest)
            const estimatedDuration = (ex.sets * 3);
            totalDuration += estimatedDuration;

            await client.query(
                `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight, order_index, notes)
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [workoutId, ex.exerciseId, ex.sets, ex.reps, ex.weight || 0, i, ex.notes || '']
            );
        }

        // Update total duration
        await client.query(
            `UPDATE workouts SET total_duration = $1 WHERE id = $2`,
            [totalDuration, workoutId]
        );

        await client.query('COMMIT');

        return NextResponse.json({
            success: true,
            workoutId: workoutId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating workout:', error);
        if (typeof error === 'object' && error !== null && 'detail' in error) {
            console.error('Error detail:', (error as { detail?: string }).detail);
        }

        return NextResponse.json(
            { error: 'Failed to create workout: ' + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    } finally {
        client.release();
    }
}
