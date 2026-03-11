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

export interface WorkoutExercise {
  id: string;
  exercise_id: string;
  sets?: number;
  reps?: number;
  weight?: number;
}

export interface Exercise {
  id: string;
  name: string;
  muscle_group?: string;
}

// Start a new workout session
export async function startWorkoutSession(
  clientId: string,
  workoutId: string,
  notes?: string
): Promise<WorkoutSession> {
  if (!clientId || !workoutId) throw new Error('clientId and workoutId are required');

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

  if (error) throw error;

  return {
    id: session.id,
    clientId: session.client_id,
    workoutId: session.workout_id,
    startedAt: session.started_at,
    notes: session.notes,
    status: session.status
  };
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
  if (!sessionId || !workoutExerciseId) throw new Error('sessionId and workoutExerciseId are required');

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

  if (error) throw error;

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
}

// Complete a workout session
export async function completeWorkoutSession(
  sessionId: string,
  durationMinutes: number,
  notes?: string
): Promise<WorkoutSession> {
  // 1. Update session
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

  if (updateError) throw updateError;
  if (!session) throw new Error('Session not found or failed to update');

  // 2. Fetch exercise logs
  const { data: logs, error: logsError } = await supabase
    .from('exercise_logs')
    .select('id, workout_exercise_id, sets_completed, reps_completed, weight_used, notes')
    .eq('workout_session_id', sessionId);

  if (logsError) throw logsError;

  // 3. Map workoutExerciseId → exerciseId
  const workoutExerciseIds = logs?.map(log => log.workout_exercise_id) || [];
  let exerciseIdMap: Record<string, string> = {};

  if (workoutExerciseIds.length > 0) {
    const { data: workoutExercises, error: weError } = await supabase
      .from('workout_exercises')
      .select('id, exercise_id')
      .in('id', workoutExerciseIds);

    if (weError) throw weError;

    const exercises: WorkoutExercise[] = workoutExercises || [];
    exerciseIdMap = exercises.reduce<Record<string, string>>((map, we) => {
      map[we.id] = we.exercise_id;
      return map;
    }, {});
  }

  // 4. Insert logs into progress_metrics
  for (const log of logs || []) {
    const exerciseId = exerciseIdMap[log.workout_exercise_id];
    if (!exerciseId) continue;

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
}

// Get workout history
export async function getWorkoutHistory(clientId: string, limit = 20): Promise<Record<string, unknown>[]> {
  const { data: history, error } = await supabase
    .from('workout_sessions')
    .select('id, client_id, workout_id, started_at, completed_at, duration_minutes, status, notes')
    .eq('client_id', clientId)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) throw error;

  const workoutIds = (history || []).map(h => h.workout_id).filter(Boolean);
  let workoutMap: Record<string, { name: string }> = {};

  if (workoutIds.length > 0) {
    const { data: workouts, error: wError } = await supabase
      .from('workouts')
      .select('id, name')
      .in('id', workoutIds);

    if (wError) throw wError;

    workoutMap = (workouts || []).reduce<Record<string, { name: string }>>((map, w) => {
      map[w.id] = { name: w.name };
      return map;
    }, {});
  }

  const sessionIds = (history || []).map(h => h.id);
  let exerciseLogsCountMap: Record<string, number> = {};

  if (sessionIds.length > 0) {
    const { data: logsCount, error: lcError } = await supabase
      .from('exercise_logs')
      .select('id, workout_session_id')
      .in('workout_session_id', sessionIds);

    if (lcError) throw lcError;

    exerciseLogsCountMap = (logsCount || []).reduce<Record<string, number>>((map, log) => {
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
}

// Get progress data
export async function getProgressData(clientId: string, exerciseId?: string, days = 30): Promise<ProgressMetric[]> {
  let query = supabase
    .from('progress_metrics')
    .select('id, client_id, exercise_id, date, weight_lifted, reps, sets, total_volume, notes')
    .eq('client_id', clientId)
    .gte('date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .order('date', { ascending: true });

  if (exerciseId && exerciseId !== 'all') query = query.eq('exercise_id', exerciseId);

  const { data: metrics, error } = await query;
  if (error) throw error;

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
}

// Get exercise session logs
export async function getSessionExerciseLogs(sessionId: string): Promise<Record<string, unknown>[]> {
  const { data: logs, error } = await supabase
    .from('exercise_logs')
    .select('id, workout_session_id, workout_exercise_id, sets_completed, reps_completed, weight_used, duration_seconds, rpe, notes')
    .eq('workout_session_id', sessionId)
    .order('created_at', { ascending: true });

  if (error) throw error;

  const workoutExerciseIds = logs?.map(l => l.workout_exercise_id) || [];
  const workoutExerciseMap: Record<string, WorkoutExercise> = {};

  if (workoutExerciseIds.length > 0) {
    const { data: workoutExercises, error: weError } = await supabase
      .from('workout_exercises')
      .select('id, sets, reps, weight, exercise_id')
      .in('id', workoutExerciseIds);

    if (weError) throw weError;

    (workoutExercises || []).forEach((we: WorkoutExercise) => {
      workoutExerciseMap[we.id] = we;
    });
  }

  const exerciseIds = Object.values(workoutExerciseMap).map(we => we.exercise_id).filter(Boolean);
  const exerciseMap: Record<string, Exercise> = {};

  if (exerciseIds.length > 0) {
    const { data: exercises, error: exError } = await supabase
      .from('exercises')
      .select('id, name, muscle_group')
      .in('id', exerciseIds);

    if (exError) throw exError;

    (exercises || []).forEach((ex: Exercise) => {
      exerciseMap[ex.id] = ex;
    });
  }

  return (logs || []).map(log => {
    const workoutExercise = workoutExerciseMap[log.workout_exercise_id];
    const exercise = workoutExercise ? exerciseMap[workoutExercise.exercise_id] : undefined;

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
}

// Calculate client stats including streak
export async function getClientStreakStats(clientId: string): Promise<Record<string, unknown>> {
  const { data: sessions, error: basicError } = await supabase
    .from('workout_sessions')
    .select('id, completed_at, duration_minutes')
    .eq('client_id', clientId)
    .eq('status', 'completed');

  if (basicError) throw basicError;

  const totalCompleted = (sessions || []).length;
  const lastWorkout = sessions && sessions[0]?.completed_at || null;
  const avgDuration = totalCompleted > 0
    ? Math.round((sessions || []).reduce((sum, s) => sum + (s.duration_minutes || 0), 0) / totalCompleted)
    : 0;

  // Current streak
  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const uniqueDates = [...new Set((sessions || []).map(s => new Date(s.completed_at).toDateString()))].sort().reverse();

  if (uniqueDates.length > 0) {
    const lastWorkoutDate = new Date(uniqueDates[0]);
    lastWorkoutDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil(Math.abs(today.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      const expectedDate = new Date(lastWorkoutDate);
      for (const dateStr of uniqueDates) {
        const date = new Date(dateStr);
        date.setHours(0, 0, 0, 0);
        if (date.getTime() === expectedDate.getTime()) {
          currentStreak++;
          expectedDate.setDate(expectedDate.getDate() - 1);
        } else break;
      }
    }
  }

  return { totalCompleted, lastWorkout, avgDuration, currentStreak };
}

// Get all logged exercises for a client
export async function getLoggedExercises(clientId: string): Promise<Record<string, unknown>[]> {
  const { data: metrics, error } = await supabase
    .from('progress_metrics')
    .select(`id, exercise:exercise_id(id, name, muscle_group)`)
    .eq('client_id', clientId)
    .order('exercise_id', { ascending: true });

  if (error) throw error;

  const unique = new Map<string, { id: string; name: string; muscleGroup?: string }>();
  (metrics || []).forEach(m => {
    const ex = m.exercise as unknown as Exercise;
    if (ex && !unique.has(ex.id)) {
      unique.set(ex.id, { id: ex.id, name: ex.name, muscleGroup: ex.muscle_group });
    }
  });

  return Array.from(unique.values());
}