import { query } from './db';

export interface WorkoutSession {
  id: string;
  clientId: string;
  workoutId: string;
  startedAt: string;
  completedAt?: string;
  durationMinutes?: number;
  notes?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
}

export interface ExerciseLog {
  id: string;
  workoutSessionId: string;
  workoutExerciseId: string;
  setsCompleted: number;
  repsCompleted: number;
  weightUsed?: number;
  durationSeconds?: number;
  notes?: string;
  rpe?: number;
}

export interface ProgressMetric {
  id: string;
  clientId: string;
  exerciseId: string;
  date: string;
  weightLifted?: number;
  reps: number;
  sets: number;
  totalVolume?: number;
  notes?: string;
}

// Start a new workout session
export async function startWorkoutSession(
  clientId: string,
  workoutId: string,
  notes?: string
): Promise<WorkoutSession> {
  try {
    if (!clientId || !workoutId) {
      throw new Error('clientId and workoutId are required');
    }

    const result = await query(
      `INSERT INTO workout_sessions (client_id, workout_id, started_at, notes, status)
       VALUES ($1, $2, NOW(), $3, 'in_progress')
       RETURNING id, client_id as "clientId", workout_id as "workoutId", 
                 started_at as "startedAt", notes, status`,
      [clientId, workoutId, notes]
    );

    if (!result.rows[0]) {
      throw new Error('Failed to create workout session');
    }

    return result.rows[0];
  } catch (error) {
    console.error('Error starting workout session:', error);
    throw error;
  }
}

// Log exercise performance
export async function logExercise(
  sessionId: string,
  workoutExerciseId: string,
  setsCompleted: number,
  repsCompleted: number,
  weightUsed?: number,
  rpe?: number,
  notes?: string
): Promise<ExerciseLog> {
  try {
    if (!sessionId || !workoutExerciseId) {
      throw new Error('sessionId and workoutExerciseId are required');
    }

    const result = await query(
      `INSERT INTO exercise_logs 
       (workout_session_id, workout_exercise_id, sets_completed, reps_completed, weight_used, rpe, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, workout_session_id as "workoutSessionId", workout_exercise_id as "workoutExerciseId",
                 sets_completed as "setsCompleted", reps_completed as "repsCompleted", 
                 weight_used as "weightUsed", rpe, notes`,
      [sessionId, workoutExerciseId, setsCompleted, repsCompleted, weightUsed, rpe, notes]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error logging exercise:', error);
    throw error;
  }
}

// Complete a workout session
export async function completeWorkoutSession(
  sessionId: string,
  durationMinutes: number,
  notes?: string
): Promise<WorkoutSession> {
  try {
    const result = await query(
      `UPDATE workout_sessions 
       SET completed_at = NOW(), duration_minutes = $2, status = 'completed', notes = $3
       WHERE id = $1
       RETURNING id, client_id as "clientId", workout_id as "workoutId", 
                 started_at as "startedAt", completed_at as "completedAt",
                 duration_minutes as "durationMinutes", notes, status`,
      [sessionId, durationMinutes, notes]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error completing workout session:', error);
    throw error;
  }
}

// Get workout history for a client
export async function getWorkoutHistory(clientId: string, limit = 20): Promise<any[]> {
  try {
    const result = await query(
      `SELECT 
        ws.id,
        ws.client_id as "clientId",
        ws.workout_id as "workoutId",
        w.name as "workoutName",
        ws.started_at as "startedAt",
        ws.completed_at as "completedAt",
        ws.duration_minutes as "durationMinutes",
        ws.status,
        COUNT(el.id) as "exercisesLogged",
        ws.notes
      FROM workout_sessions ws
      JOIN workouts w ON ws.workout_id = w.id
      LEFT JOIN exercise_logs el ON ws.id = el.workout_session_id
      WHERE ws.client_id = $1
      GROUP BY ws.id, ws.client_id, ws.workout_id, w.name, ws.started_at, 
               ws.completed_at, ws.duration_minutes, ws.status, ws.notes
      ORDER BY ws.started_at DESC
      LIMIT $2`,
      [clientId, limit]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching workout history:', error);
    throw error;
  }
}

// Get progress data for charts
export async function getProgressData(clientId: string, exerciseId?: string, days = 30): Promise<ProgressMetric[]> {
  try {
    const params: any[] = [clientId, new Date(Date.now() - days * 24 * 60 * 60 * 1000)];
    let whereClause = `WHERE pm.client_id = $1 AND pm.date >= $2`;
    
    if (exerciseId) {
      whereClause += ` AND pm.exercise_id = $3`;
      params.push(exerciseId);
    }

    const result = await query(
      `SELECT 
        id,
        client_id as "clientId",
        exercise_id as "exerciseId",
        date,
        weight_lifted as "weightLifted",
        reps,
        sets,
        total_volume as "totalVolume",
        notes
      FROM progress_metrics pm
      ${whereClause}
      ORDER BY pm.date ASC`,
      params
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
}

// Get exercise session logs
export async function getSessionExerciseLogs(sessionId: string): Promise<any[]> {
  try {
    const result = await query(
      `SELECT 
        el.id,
        el.workout_session_id as "workoutSessionId",
        el.workout_exercise_id as "workoutExerciseId",
        e.name as "exerciseName",
        el.sets_completed as "setsCompleted",
        el.reps_completed as "repsCompleted",
        el.weight_used as "weightUsed",
        el.duration_seconds as "durationSeconds",
        el.rpe,
        el.notes,
        we.sets as "plannedSets",
        we.reps as "plannedReps",
        we.weight as "plannedWeight"
      FROM exercise_logs el
      JOIN workout_exercises we ON el.workout_exercise_id = we.id
      JOIN exercises e ON we.exercise_id = e.id
      WHERE el.workout_session_id = $1
      ORDER BY el.created_at ASC`,
      [sessionId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching session exercise logs:', error);
    throw error;
  }
}

// Calculate client stats including streak
export async function getClientStreakStats(clientId: string): Promise<any> {
  try {
    const result = await query(
      `SELECT 
        COUNT(DISTINCT DATE(completed_at)) as "totalCompleted",
        MAX(completed_at) as "lastWorkout",
        COALESCE(AVG(EXTRACT(EPOCH FROM (completed_at - started_at))/60), 0)::INTEGER as "avgDuration"
      FROM workout_sessions
      WHERE client_id = $1 AND status = 'completed'`,
      [clientId]
    );
    return result.rows[0] || { totalCompleted: 0, lastWorkout: null, avgDuration: 0 };
  } catch (error) {
    console.error('Error calculating streak stats:', error);
    throw error;
  }
}
