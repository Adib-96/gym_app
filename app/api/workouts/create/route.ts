
import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import supabase from '@/lib/supabase-server';

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

        let validClientId = '';
        let actualClientId = '';

        // Handle temporary client IDs (format: temp-{user_id})
        if (clientId.startsWith('temp-')) {
            const userId = clientId.replace('temp-', '');
            
            // Check if client record already exists
            const { data: existingClient, error: existingError } = await supabase
                .from('clients')
                .select('id, user_id')
                .eq('user_id', userId)
                .maybeSingle();

            if (existingError) {
                throw existingError;
            }

            if (existingClient) {
                // Client already exists, verify it's assigned to the coach
                const { data: assigned, error: assignError } = await supabase
                    .from('clients')
                    .select('id, user_id')
                    .eq('id', existingClient.id)
                    .eq('coach_id', user.userId)
                    .maybeSingle();

                if (assignError) {
                    throw assignError;
                }

                if (!assigned) {
                    return NextResponse.json(
                        { error: 'Client not assigned to you' },
                        { status: 403 }
                    );
                }

                actualClientId = existingClient.id;
                validClientId = existingClient.user_id;
            } else {
                // Create new client record first
                const { data: newClient, error: createError } = await supabase
                    .from('clients')
                    .insert([{
                        user_id: userId,
                        coach_id: user.userId,
                        status: 'Active'
                    }])
                    .select('id')
                    .single();

                if (createError) {
                    throw createError;
                }

                actualClientId = newClient.id;
                validClientId = userId;
            }
        } else {
            // Existing client ID - verify it belongs to coach
            const { data: clientCheck, error: checkError } = await supabase
                .from('clients')
                .select('id, user_id')
                .eq('id', clientId)
                .eq('coach_id', user.userId)
                .maybeSingle();

            if (checkError) {
                throw checkError;
            }

            if (!clientCheck) {
                return NextResponse.json(
                    { error: 'Client not found or not assigned to you' },
                    { status: 404 }
                );
            }

            actualClientId = clientCheck.id;
            validClientId = clientCheck.user_id;
        }

        // Validate exercises
        const exercisesWithValidation = exercises.map(ex => {
            if (!ex.exerciseId || !ex.sets || !ex.reps) {
                throw new Error('Each exercise must have ID, sets, and reps');
            }
            return ex;
        });

        // Calculate total duration
        let totalDuration = 0;
        for (const ex of exercisesWithValidation) {
            const estimatedDuration = ex.sets * 3; // 2 min per set + 1 min rest
            totalDuration += estimatedDuration;
        }

        // Create Workout
        const { data: workout, error: workoutError } = await supabase
            .from('workouts')
            .insert([{
                client_id: validClientId,
                name,
                description: description || '',
                status: 'pending',
                assigned_date: new Date().toISOString(),
                scheduled_date: scheduledDate || null,
                total_duration: totalDuration
            }])
            .select('id')
            .single();

        if (workoutError) {
            console.error('Workout creation error:', workoutError);
            throw workoutError;
        }

        const workoutId = workout.id;

        // Insert Exercises
        const exerciseInserts = exercisesWithValidation.map((ex, index) => ({
            workout_id: workoutId,
            exercise_id: ex.exerciseId,
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight || 0,
            order_index: index,
            notes: ex.notes || ''
        }));

        const { error: exercisesError } = await supabase
            .from('workout_exercises')
            .insert(exerciseInserts);

        if (exercisesError) {
            console.error('Exercises insertion error:', exercisesError);
            throw exercisesError;
        }

        return NextResponse.json({
            success: true,
            workoutId: workoutId
        });

    } catch (error) {
        console.error('Error creating workout:', error);
        
        // Get detailed error message
        let errorMessage = 'Failed to create workout';
        if (error instanceof Error) {
            errorMessage += ': ' + error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage += ': ' + (error as any).message;
        } else if (typeof error === 'string') {
            errorMessage += ': ' + error;
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
