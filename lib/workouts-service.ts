import { query } from './db';

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
}

export interface ClientStats {
  totalWorkoutsCompleted: number;
  currentStreak: number;
  averageWorkoutTime: number;
  completionRate: number;
}

// Get all workouts for a client
export async function getClientWorkouts(clientId: string): Promise<Workout[]> {
  try {
    const result = await query(
      `SELECT 
        w.id,
        w.client_id as "clientId",
        w.name,
        w.description,
        w.total_duration as "totalDuration",
        w.status,
        w.assigned_date as "assignedDate",
        w.scheduled_date as "scheduledDate",
        COUNT(we.id) as "exerciseCount"
      FROM workouts w
      LEFT JOIN workout_exercises we ON w.id = we.workout_id
      WHERE w.client_id = $1
      GROUP BY w.id, w.client_id, w.name, w.description, w.total_duration, w.status, w.assigned_date, w.scheduled_date
      ORDER BY w.assigned_date DESC`,
      [clientId]
    );

    // Fetch exercises for each workout
    const workoutsWithExercises = await Promise.all(
      result.rows.map(async (workout) => {
        const exercisesResult = await query(
          `SELECT 
            we.id,
            e.name as "exerciseName",
            we.sets,
            we.reps,
            we.weight,
            we.duration,
            e.muscle_group as "muscleGroup",
            e.description
          FROM workout_exercises we
          JOIN exercises e ON we.exercise_id = e.id
          WHERE we.workout_id = $1
          ORDER BY we.order_index ASC`,
          [workout.id]
        );

        return {
          ...workout,
          exercises: exercisesResult.rows,
        };
      })
    );

    return workoutsWithExercises as Workout[];
  } catch (error) {
    console.error('Error fetching client workouts:', error);
    throw error;
  }
}

// Get single workout with all details
export async function getWorkoutById(workoutId: string): Promise<Workout | null> {
  try {
    const result = await query(
      `SELECT 
        w.id,
        w.client_id as "clientId",
        w.name,
        w.description,
        w.total_duration as "totalDuration",
        w.status,
        w.assigned_date as "assignedDate",
        w.scheduled_date as "scheduledDate"
      FROM workouts w
      WHERE w.id = $1`,
      [workoutId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    const workout = result.rows[0];

    const exercisesResult = await query(
      `SELECT 
        we.id,
        e.name as "exerciseName",
        we.sets,
        we.reps,
        we.weight,
        we.duration,
        e.muscle_group as "muscleGroup",
        e.description
      FROM workout_exercises we
      JOIN exercises e ON we.exercise_id = e.id
      WHERE we.workout_id = $1
      ORDER BY we.order_index ASC`,
      [workoutId]
    );

    return {
      ...workout,
      exercises: exercisesResult.rows,
      exerciseCount: exercisesResult.rows.length,
    };
  } catch (error) {
    console.error('Error fetching workout:', error);
    throw error;
  }
}

// Get client statistics
export async function getClientStats(clientId: string): Promise<ClientStats> {
  try {
    const result = await query(
      `SELECT 
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as "totalCompleted",
        COALESCE(AVG(CASE WHEN status = 'completed' THEN total_duration END), 0) as "avgDuration",
        COUNT(*) as "totalWorkouts"
      FROM workouts
      WHERE client_id = $1 AND status IN ('completed', 'active', 'pending')`,
      [clientId]
    );

    const stats = result.rows[0];
    const totalCompleted = parseInt(stats.totalCompleted) || 0;
    const totalWorkouts = parseInt(stats.totalWorkouts) || 0;

    return {
      totalWorkoutsCompleted: totalCompleted,
      currentStreak: 0, // Should be calculated based on daily completions
      averageWorkoutTime: Math.round(parseFloat(stats.avgDuration) || 0),
      completionRate: totalWorkouts > 0 ? Math.round((totalCompleted / totalWorkouts) * 100) : 0,
    };
  } catch (error) {
    console.error('Error fetching client stats:', error);
    throw error;
  }
}
