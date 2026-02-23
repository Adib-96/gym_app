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
    // 1. Update the session status
    const result = await query(
      `UPDATE workout_sessions 
       SET completed_at = NOW(), duration_minutes = $2, status = 'completed', notes = $3
       WHERE id = $1
       RETURNING id, client_id as "clientId", workout_id as "workoutId", 
                 started_at as "startedAt", completed_at as "completedAt",
                 duration_minutes as "durationMinutes", notes, status`,
      [sessionId, durationMinutes, notes]
    );

    const session = result.rows[0];
    if (!session) {
      throw new Error('Session not found or failed to update');
    }

    // 2. Fetch all exercise logs for this session to update progress metrics
    const logs = await query(
      `SELECT 
        we.exercise_id,
        el.sets_completed,
        el.reps_completed,
        el.weight_used,
        el.notes
      FROM exercise_logs el
      JOIN workout_exercises we ON el.workout_exercise_id = we.id
      WHERE el.workout_session_id = $1`,
      [sessionId]
    );

    // 3. Insert each log into progress_metrics
    for (const log of logs.rows) {
      const totalVolume = (log.sets_completed || 0) * (log.reps_completed || 0) * (log.weight_used || 0);

      await query(
        `INSERT INTO progress_metrics 
          (client_id, exercise_id, date, weight_lifted, reps, sets, total_volume, notes)
         VALUES ($1, $2, CURRENT_DATE, $3, $4, $5, $6, $7)
         ON CONFLICT ON CONSTRAINT unique_metric 
         DO UPDATE SET 
          weight_lifted = EXCLUDED.weight_lifted,
          reps = EXCLUDED.reps,
          sets = EXCLUDED.sets,
          total_volume = EXCLUDED.total_volume,
          notes = EXCLUDED.notes`,
        [
          session.clientId,
          log.exercise_id,
          log.weight_used || 0,
          log.reps_completed || 0,
          log.sets_completed || 0,
          totalVolume,
          log.notes
        ]
      );
    }

    return session;
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

    if (exerciseId && exerciseId !== 'all') {
      whereClause += ` AND pm.exercise_id = $3`;
      params.push(exerciseId);
    }

    const result = await query(
      `SELECT 
        pm.id,
        pm.client_id as "clientId",
        pm.exercise_id as "exerciseId",
        e.name as "exerciseName",
        pm.date,
        pm.weight_lifted as "weightLifted",
        pm.reps,
        pm.sets,
        pm.total_volume as "totalVolume",
        pm.notes
      FROM progress_metrics pm
      JOIN exercises e ON pm.exercise_id = e.id
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
    // 1. Basic stats
    const basicStatsResult = await query(
      `SELECT 
        COUNT(*) as "totalCompleted",
        MAX(completed_at) as "lastWorkout",
        COALESCE(AVG(duration_minutes), 0)::INTEGER as "avgDuration"
      FROM workout_sessions
      WHERE client_id = $1 AND status = 'completed'`,
      [clientId]
    );

    // 2. Calculate current streak
    const datesResult = await query(
      `SELECT DISTINCT DATE(completed_at) as workout_date
       FROM workout_sessions
       WHERE client_id = $1 AND status = 'completed'
       ORDER BY workout_date DESC`,
      [clientId]
    );

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dates = datesResult.rows.map(r => new Date(r.workout_date));

    if (dates.length > 0) {
      let checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);

      // If the last workout was not today or yesterday, streak is broken
      const lastWorkoutDate = new Date(dates[0]);
      lastWorkoutDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - lastWorkoutDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        // Calculate streak
        let expectedDate = lastWorkoutDate;
        for (const date of dates) {
          date.setHours(0, 0, 0, 0);
          if (date.getTime() === expectedDate.getTime()) {
            currentStreak++;
            expectedDate.setDate(expectedDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    const stats = basicStatsResult.rows[0] || { totalCompleted: 0, lastWorkout: null, avgDuration: 0 };
    return {
      ...stats,
      currentStreak
    };

  } catch (error) {
    console.error('Error calculating streak stats:', error);
    throw error;
  }
}

// Get all exercises that have entries in progress_metrics for a client
export async function getLoggedExercises(clientId: string): Promise<any[]> {
  try {
    const result = await query(
      `SELECT DISTINCT 
        e.id, 
        e.name, 
        e.muscle_group as "muscleGroup"
      FROM progress_metrics pm
      JOIN exercises e ON pm.exercise_id = e.id
      WHERE pm.client_id = $1
      ORDER BY e.name ASC`,
      [clientId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching logged exercises:', error);
    throw error;
  }
}
