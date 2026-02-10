import { query } from './db';

// Sample function to seed workout data for testing
export async function seedWorkoutData(clientId: string) {
  const workoutNames = [
    { name: 'Full Body Strength', description: 'Complete upper and lower body workout', duration: 60 },
    { name: 'Upper Body Power', description: 'Chest, back, and shoulders focus', duration: 50 },
    { name: 'Lower Body Blast', description: 'Legs and glutes intensive training', duration: 55 },
    { name: 'Cardio Circuit', description: 'High-intensity interval training', duration: 30 },
  ];

  const sampleExercises = [
    { name: 'Barbell Back Squat', sets: 4, reps: 6, weight: 100 },
    { name: 'Barbell Bench Press', sets: 4, reps: 8, weight: 80 },
    { name: 'Deadlift', sets: 3, reps: 5, weight: 120 },
    { name: 'Pull-ups', sets: 4, reps: 8, weight: null },
    { name: 'Dumbbell Rows', sets: 4, reps: 10, weight: 35 },
    { name: 'Cable Lateral Raise', sets: 3, reps: 12, weight: null },
    { name: 'Leg Press', sets: 3, reps: 10, weight: 250 },
    { name: 'Barbell Shoulder Press', sets: 4, reps: 8, weight: 60 },
  ];

  try {
    // Create workouts
    for (const workout of workoutNames) {
      const result = await query(
        `INSERT INTO workouts (client_id, name, description, total_duration, status, assigned_date, scheduled_date)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          clientId,
          workout.name,
          workout.description,
          workout.duration,
          Math.random() > 0.5 ? 'active' : 'pending',
          new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in past 7 days
          new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in next 7 days
        ]
      );

      const workoutId = result.rows[0].id;

      // Add exercises to workout
      const exercisesToAdd = sampleExercises.slice(0, Math.floor(Math.random() * 4) + 3);
      
      for (let i = 0; i < exercisesToAdd.length; i++) {
        const exercise = exercisesToAdd[i];
        // Get exercise id from exercises table
        const exerciseResult = await query(
          `SELECT id FROM exercises WHERE name = $1 LIMIT 1`,
          [exercise.name]
        );

        if (exerciseResult.rows.length > 0) {
          await query(
            `INSERT INTO workout_exercises (workout_id, exercise_id, sets, reps, weight, order_index)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [workoutId, exerciseResult.rows[0].id, exercise.sets, exercise.reps, exercise.weight, i]
          );
        }
      }
    }

    console.log('Workout data seeded successfully!');
  } catch (error) {
    console.error('Error seeding workout data:', error);
    throw error;
  }
}
