import { NextRequest, NextResponse } from 'next/server';
import { authenticateRequest } from '@/lib/auth';
import { query } from '@/lib/db';
import { WorkoutSchema } from '@/lib/validation';

// GET workouts (protected)
export async function GET(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);
  
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    let workouts;
    
    if (user.role === 'coach') {
      // Coach sees their own workouts
      workouts = await query(
        'SELECT * FROM workouts WHERE coach_id = $1 ORDER BY created_at DESC',
        [user.userId]
      );
    } else {
      // Client sees assigned workouts
      workouts = await query(
        `SELECT w.* FROM workouts w
         JOIN client_workouts cw ON w.id = cw.workout_id
         WHERE cw.client_id = $1 AND cw.status != 'completed'
         ORDER BY cw.assigned_date`,
        [user.userId]
      );
    }
    
    return NextResponse.json({ workouts: workouts.rows });
    
  } catch (error) {
    console.error('Error fetching workouts:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create workout (coach only)
export async function POST(request: NextRequest) {
  const { user, error } = await authenticateRequest(request);
  
  if (error || !user || user.role !== 'coach') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validatedData = WorkoutSchema.parse(body);
    
    // Ensure coach can only create workouts for themselves
    if (validatedData.coach_id !== user.userId) {
      return NextResponse.json(
        { error: 'Cannot create workouts for other coaches' },
        { status: 403 }
      );
    }
    
    const result = await query(
      `INSERT INTO workouts (name, description, scheduled_date, coach_id) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [validatedData.name, validatedData.description, validatedData.scheduled_date, user.userId]
    );
    
    return NextResponse.json({ workout: result.rows[0] });
    
  } catch (error: any) {
    console.error('Error creating workout:', error);
    
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}