import supabase from './supabase-server';

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

    const { data: session, error } = await supabase
      .from('workout_sessions')
      .insert([{
        client_id: clientId,
        workout_id: workoutId,
        started_at: new Date().toISOString(),
        notes,
        status: 'in_progress'
      }])
      .select('id, client_id, workout_id, started_at, notes, status')
      .single();

    if (error) {
      throw error;
    }

    return {
      id: session.id,
      clientId: session.client_id,
      workoutId: session.workout_id,
      startedAt: session.started_at,
      notes: session.notes,
      status: session.status
    };
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

    const { data: log, error } = await supabase
      .from('exercise_logs')
      .insert([{
        workout_session_id: sessionId,
        workout_exercise_id: workoutExerciseId,
        sets_completed: setsCompleted,
        reps_completed: repsCompleted,
        weight_used: weightUsed,
        rpe,
        notes
      }])
      .select('id, workout_session_id, workout_exercise_id, sets_completed, reps_completed, weight_used, rpe, notes')
      .single();

    if (error) {
      throw error;
    }

    return {
      id: log.id,
      workoutSessionId: log.workout_session_id,
      workoutExerciseId: log.workout_exercise_id,
      setsCompleted: log.sets_completed,
      repsCompleted: log.reps_completed,
      weightUsed: log.weight_used,
      rpe: log.rpe,
      notes: log.notes
    };
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
    const { data: session, error: updateError } = await supabase
      .from('workout_sessions')
      .update({
        completed_at: new Date().toISOString(),
        duration_minutes: durationMinutes,
        status: 'completed',
        notes
      })
      .eq('id', sessionId)
      .select('id, client_id, workout_id, started_at, completed_at, duration_minutes, notes, status')
      .single();

    if (updateError) {
      throw updateError;
    }

    if (!session) {
      throw new Error('Session not found or failed to update');
    }

    // 2. Fetch all exercise logs for this session
    const { data: logs, error: logsError } = await supabase
      .from('exercise_logs')
      .select('id, workout_exercise_id, sets_completed, reps_completed, weight_used, notes')
      .eq('workout_session_id', sessionId);

    if (logsError) {
      throw logsError;
    }

    // 3. Fetch workout_exercises to get exercise_id
    const workoutExerciseIds = logs?.map(log => log.workout_exercise_id) || [];
    let exerciseIdMap: { [key: string]: string } = {};
    
    if (workoutExerciseIds.length > 0) {
      const { data: workoutExercises, error: weError } = await supabase
        .from('workout_exercises')
        .select('id, exercise_id')
        .in('id', workoutExerciseIds);

      if (weError) {
        throw weError;
      }

      exerciseIdMap = (workoutExercises || []).reduce((map, we) => {
        map[we.id] = we.exercise_id;
        return map;
      }, {});
    }

    // 4. Insert each log into progress_metrics
    for (const log of logs || []) {
      const exerciseId = exerciseIdMap[log.workout_exercise_id];
      if (exerciseId) {
        const totalVolume = (log.sets_completed || 0) * (log.reps_completed || 0) * (log.weight_used || 0);

        await supabase
          .from('progress_metrics')
          .upsert([{
            client_id: session.client_id,
            exercise_id: exerciseId,
            date: new Date().toISOString().split('T')[0],
            weight_lifted: log.weight_used || 0,
            reps: log.reps_completed || 0,
            sets: log.sets_completed || 0,
            total_volume: totalVolume,
            notes: log.notes
          }], {
            onConflict: 'client_id,exercise_id,date'
          });
      }
    }

    return {
      id: session.id,
      clientId: session.client_id,
      workoutId: session.workout_id,
      startedAt: session.started_at,
      completedAt: session.completed_at,
      durationMinutes: session.duration_minutes,
      notes: session.notes,
      status: session.status
    };
  } catch (error) {
    console.error('Error completing workout session:', error);
    throw error;
  }
}

// Get workout history for a client
export async function getWorkoutHistory(clientId: string, limit = 20): Promise<Record<string, unknown>[]> {
  try {
    const { data: history, error } = await supabase
      .from('workout_sessions')
      .select(`
        id,
        client_id,
        workout_id,
        started_at,
        completed_at,
        duration_minutes,
        status,
        notes
      `)
      .eq('client_id', clientId)
      .order('started_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Fetch exercise logs count and workout names
    const workoutIds = (history || []).map(h => h.workout_id).filter(Boolean);
    let workoutMap: { [key: string]: { name: string } } = {};
    
    if (workoutIds.length > 0) {
      const { data: workouts, error: wError } = await supabase
        .from('workouts')
        .select('id, name')
        .in('id', workoutIds);

      if (wError) {
        throw wError;
      }

      workoutMap = (workouts || []).reduce((map, w) => {
        map[w.id] = { name: w.name };
        return map;
      }, {});
    }

    // Fetch exercise logs count for each session
    const sessionIds = (history || []).map(h => h.id);
    let exerciseLogsCountMap: { [key: string]: number } = {};
    
    if (sessionIds.length > 0) {
      const { data: logsCount, error: lcError } = await supabase
        .from('exercise_logs')
        .select('id, workout_session_id')
        .in('workout_session_id', sessionIds);

      if (lcError) {
        throw lcError;
      }

      exerciseLogsCountMap = (logsCount || []).reduce((map, log) => {
        map[log.workout_session_id] = (map[log.workout_session_id] || 0) + 1;
        return map;
      }, {});
    }

    return (history || []).map(row => ({
      id: row.id,
      clientId: row.client_id,
      workoutId: row.workout_id,
      workoutName: workoutMap[row.workout_id]?.name || 'Unknown',
      startedAt: row.started_at,
      completedAt: row.completed_at,
      durationMinutes: row.duration_minutes,
      status: row.status,
      exercisesLogged: exerciseLogsCountMap[row.id] || 0,
      notes: row.notes
    }));
  } catch (error) {
    console.error('Error fetching workout history:', error);
    throw error;
  }
}

// Get progress data for charts
export async function getProgressData(clientId: string, exerciseId?: string, days = 30): Promise<ProgressMetric[]> {
  try {
    let query = supabase
      .from('progress_metrics')
      .select('id, client_id, exercise_id, date, weight_lifted, reps, sets, total_volume, notes')
      .eq('client_id', clientId)
      .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (exerciseId && exerciseId !== 'all') {
      query = query.eq('exercise_id', exerciseId);
    }

    const { data: metrics, error } = await query;

    if (error) {
      throw error;
    }

    return (metrics || []).map(m => ({
      id: m.id,
      clientId: m.client_id,
      exerciseId: m.exercise_id,
      date: m.date,
      weightLifted: m.weight_lifted,
      reps: m.reps,
      sets: m.sets,
      totalVolume: m.total_volume,
      notes: m.notes
    }));
  } catch (error) {
    console.error('Error fetching progress data:', error);
    throw error;
  }
}

// Get exercise session logs
export async function getSessionExerciseLogs(sessionId: string): Promise<Record<string, unknown>[]> {
  try {
    const { data: logs, error } = await supabase
      .from('exercise_logs')
      .select('id, workout_session_id, workout_exercise_id, sets_completed, reps_completed, weight_used, duration_seconds, rpe, notes')
      .eq('workout_session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) {
      throw error;
    }

    // Fetch workout_exercises with exercise_id
    const workoutExerciseIds = logs?.map(log => log.workout_exercise_id) || [];
    let workoutExerciseMap: { [key: string]: any } = {};
    
    if (workoutExerciseIds.length > 0) {
      const { data: workoutExercises, error: weError } = await supabase
        .from('workout_exercises')
        .select('id, sets, reps, weight, exercise_id')
        .in('id', workoutExerciseIds);

      if (weError) {
        throw weError;
      }

      workoutExerciseMap = (workoutExercises || []).reduce((map, we) => {
        map[we.id] = we;
        return map;
      }, {});
    }

    // Fetch exercises
    const exerciseIds = Object.values(workoutExerciseMap).map((we: any) => we.exercise_id).filter(Boolean);
    let exerciseMap: { [key: string]: any } = {};
    
    if (exerciseIds.length > 0) {
      const { data: exercises, error: exError } = await supabase
        .from('exercises')
        .select('id, name')
        .in('id', exerciseIds);

      if (exError) {
        throw exError;
      }

      exerciseMap = (exercises || []).reduce((map, ex) => {
        map[ex.id] = ex;
        return map;
      }, {});
    }

    return (logs || []).map(log => {
      const workoutExercise = workoutExerciseMap[log.workout_exercise_id];
      const exercise = exerciseMap[workoutExercise?.exercise_id];

      return {
        id: log.id,
        workoutSessionId: log.workout_session_id,
        workoutExerciseId: log.workout_exercise_id,
        exerciseName: exercise?.name || 'Unknown',
        setsCompleted: log.sets_completed,
        repsCompleted: log.reps_completed,
        weightUsed: log.weight_used,
        durationSeconds: log.duration_seconds,
        rpe: log.rpe,
        notes: log.notes,
        plannedSets: workoutExercise?.sets,
        plannedReps: workoutExercise?.reps,
        plannedWeight: workoutExercise?.weight
      };
    });
  } catch (error) {
    console.error('Error fetching session exercise logs:', error);
    throw error;
  }
}

// Calculate client stats including streak
export async function getClientStreakStats(clientId: string): Promise<Record<string, unknown>> {
  try {
    // 1. Basic stats
    const { data: basicStats, error: basicError } = await supabase
      .from('workout_sessions')
      .select('id, completed_at, duration_minutes')
      .eq('client_id', clientId)
      .eq('status', 'completed');

    if (basicError) {
      throw basicError;
    }

    const sessions = basicStats || [];
    const totalCompleted = sessions.length;
    const lastWorkout = sessions.length > 0 ? sessions[0].completed_at : null;
    const avgDuration = sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / sessions.length)
      : 0;

    // 2. Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueDates = [...new Set(sessions.map(s => new Date(s.completed_at).toDateString()))].sort().reverse();

    if (uniqueDates.length > 0) {
      const lastWorkoutDate = new Date(uniqueDates[0]);
      lastWorkoutDate.setHours(0, 0, 0, 0);

      const diffTime = Math.abs(today.getTime() - lastWorkoutDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        // Calculate streak
        const expectedDate = new Date(lastWorkoutDate);
        for (const dateStr of uniqueDates) {
          const date = new Date(dateStr);
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

    return {
      totalCompleted,
      lastWorkout,
      avgDuration,
      currentStreak
    };
  } catch (error) {
    console.error('Error calculating streak stats:', error);
    throw error;
  }
}

// Get all exercises that have entries in progress_metrics for a client
export async function getLoggedExercises(clientId: string): Promise<Record<string, unknown>[]> {
  try {
    const { data: metrics, error } = await supabase
      .from('progress_metrics')
      .select(`
        id,
        exercise:exercise_id(id, name, muscle_group)
      `)
      .eq('client_id', clientId)
      .order('exercise_id', { ascending: true });

    if (error) {
      throw error;
    }

    // Remove duplicates
    const unique = new Map();
    (metrics || []).forEach(m => {
      const ex = (m.exercise as any);
      if (ex && !unique.has(ex.id)) {
        unique.set(ex.id, {
          id: ex.id,
          name: ex.name,
          muscleGroup: ex.muscle_group
        });
      }
    });

    return Array.from(unique.values());
  } catch (error) {
    console.error('Error fetching logged exercises:', error);
    throw error;
  }
}

