import supabase from './supabase-server';
import { getClientStreakStats } from './workout-logging-service';

export interface WorkoutExercise {
  id: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  muscleGroup: string;
  description: string;
}

export interface Workout {
  id: string;
  clientId: string;
  name: string;
  description: string;
  totalDuration: number;
  status: 'active' | 'pending' | 'completed';
  assignedDate: string;
  scheduledDate?: string;
  exercises: WorkoutExercise[];
  exerciseCount: number;
  daysUntil?: number;
}

export interface ClientStats {
  totalWorkoutsCompleted: number;
  currentStreak: number;
  averageWorkoutTime: number;
  completionRate: number;
  coach?: {
    name: string;
    email: string;
    userId?: string;
  };
}

// Type for exercises fetched from supabase
interface ExerciseRow {
  id: string;
  name: string;
  muscle_group?: string;
  description?: string;
}

// Type for workout_exercises fetched from supabase


// --- Get all workouts for a client ---
export async function getClientWorkouts(clientId: string): Promise<Workout[]> {
  try {
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select(`
        id,
        client_id,
        name,
        description,
        total_duration,
        status,
        assigned_date,
        scheduled_date
      `)
      .eq('client_id', clientId)
      .order('assigned_date', { ascending: false });

    if (workoutsError) throw workoutsError;

    const workoutsWithExercises: Workout[] = await Promise.all(
      (workouts || []).map(async (workout) => {
        // Fetch workout exercises
        const { data: workoutExercises, error: woError } = await supabase
          .from('workout_exercises')
          .select('id, sets, reps, weight, duration, exercise_id')
          .eq('workout_id', workout.id)
          .order('order_index');

        if (woError) throw woError;

        // Fetch exercises referenced by this workout
        const exerciseIds = (workoutExercises || []).map(ex => ex.exercise_id);
        let exerciseMap: Record<string, ExerciseRow> = {};

        if (exerciseIds.length > 0) {
          const { data: exercises, error: exercisesError } = await supabase
            .from('exercises')
            .select('id, name, muscle_group, description')
            .in('id', exerciseIds);

          if (exercisesError) throw exercisesError;

          exerciseMap = (exercises || []).reduce<Record<string, ExerciseRow>>((map, ex) => {
            map[ex.id] = ex;
            return map;
          }, {});
        }

        const formattedExercises: WorkoutExercise[] = (workoutExercises || []).map(ex => {
          const exercise = exerciseMap[ex.exercise_id];
          return {
            id: ex.id,
            exerciseName: exercise?.name || 'Unknown',
            sets: ex.sets,
            reps: ex.reps,
            weight: ex.weight,
            duration: ex.duration,
            muscleGroup: exercise?.muscle_group || 'Unknown',
            description: exercise?.description || ''
          };
        });

        return {
          id: workout.id,
          clientId: workout.client_id,
          name: workout.name,
          description: workout.description,
          totalDuration: workout.total_duration,
          status: workout.status,
          assignedDate: workout.assigned_date,
          scheduledDate: workout.scheduled_date,
          exercises: formattedExercises,
          exerciseCount: formattedExercises.length
        };
      })
    );

    return workoutsWithExercises;
  } catch (error) {
    console.error('Error fetching client workouts:', error);
    throw error;
  }
}

// --- Get single workout by ID ---
export async function getWorkoutById(workoutId: string): Promise<Workout | null> {
  try {
    const { data: workout, error: workoutError } = await supabase
      .from('workouts')
      .select(`
        id,
        client_id,
        name,
        description,
        total_duration,
        status,
        assigned_date,
        scheduled_date
      `)
      .eq('id', workoutId)
      .maybeSingle();

    if (workoutError) throw workoutError;
    if (!workout) return null;

    const { data: workoutExercises, error: woError } = await supabase
      .from('workout_exercises')
      .select('id, sets, reps, weight, duration, exercise_id')
      .eq('workout_id', workoutId)
      .order('order_index');

    if (woError) throw woError;

    const exerciseIds = (workoutExercises || []).map(ex => ex.exercise_id);
    let exerciseMap: Record<string, ExerciseRow> = {};

    if (exerciseIds.length > 0) {
      const { data: exercises, error: exercisesError } = await supabase
        .from('exercises')
        .select('id, name, muscle_group, description')
        .in('id', exerciseIds);

      if (exercisesError) throw exercisesError;

      exerciseMap = (exercises || []).reduce<Record<string, ExerciseRow>>((map, ex) => {
        map[ex.id] = ex;
        return map;
      }, {});
    }

    const formattedExercises: WorkoutExercise[] = (workoutExercises || []).map(ex => {
      const exercise = exerciseMap[ex.exercise_id];
      return {
        id: ex.id,
        exerciseName: exercise?.name || 'Unknown',
        sets: ex.sets,
        reps: ex.reps,
        weight: ex.weight,
        duration: ex.duration,
        muscleGroup: exercise?.muscle_group || 'Unknown',
        description: exercise?.description || ''
      };
    });

    return {
      id: workout.id,
      clientId: workout.client_id,
      name: workout.name,
      description: workout.description,
      totalDuration: workout.total_duration,
      status: workout.status,
      assignedDate: workout.assigned_date,
      scheduledDate: workout.scheduled_date,
      exercises: formattedExercises,
      exerciseCount: formattedExercises.length
    };
  } catch (error) {
    console.error('Error fetching workout by ID:', error);
    throw error;
  }
}

// --- Get client statistics ---
export async function getClientStats(clientId: string): Promise<ClientStats> {
  try {
    // Fetch workouts
    const { data: workouts, error: workoutsError } = await supabase
      .from('workouts')
      .select('id, status, total_duration')
      .eq('client_id', clientId)
      .in('status', ['completed', 'active', 'pending']);

    if (workoutsError) throw workoutsError;

    const totalWorkouts = workouts?.length || 0;
    const completedCount = workouts?.filter(w => w.status === 'completed').length || 0;
    const avgDuration = completedCount > 0
      ? Math.round(workouts!.filter(w => w.status === 'completed').reduce((sum, w) => sum + (w.total_duration || 0), 0) / completedCount)
      : 0;

    // Streak stats from workout logging service
    const streakStats = await getClientStreakStats(clientId);

    // Coach information
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('coach_id')
      .eq('user_id', clientId)
      .maybeSingle();

    if (clientError) throw clientError;

    let coach: { name: string; email: string; userId?: string } | undefined;
    if (clientData?.coach_id) {
      const { data: coachUser, error: coachError } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('id', clientData.coach_id)
        .maybeSingle();

      if (coachError) throw coachError;
      if (coachUser) {
        coach = {
          name: coachUser.name,
          email: coachUser.email,
          userId: coachUser.id
        };
      }
    }

    return {
      totalWorkoutsCompleted: completedCount,
      currentStreak: Number(streakStats.currentStreak) || 0,
      averageWorkoutTime: avgDuration,
      completionRate: totalWorkouts > 0 ? Math.round((completedCount / totalWorkouts) * 100) : 0,
      coach
    };
  } catch (error) {
    console.error('Error fetching client stats:', error);
    throw error;
  }
}