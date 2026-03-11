import supabase from './supabase-server';

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
      const { data: createdWorkout, error: workoutError } = await supabase
        .from('workouts')
        .insert([{
          client_id: clientId,
          name: workout.name,
          description: workout.description,
          total_duration: workout.duration,
          status: Math.random() > 0.5 ? 'active' : 'pending',
          assigned_date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          scheduled_date: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
        }])
        .select('id')
        .single();

      if (workoutError) {
        throw workoutError;
      }

      const workoutId = createdWorkout.id;

      // Add exercises to workout
      const exercisesToAdd = sampleExercises.slice(0, Math.floor(Math.random() * 4) + 3);
      
      for (let i = 0; i < exercisesToAdd.length; i++) {
        const exercise = exercisesToAdd[i];
        // Get exercise id from exercises table
        const { data: exerciseData, error: exerciseError } = await supabase
          .from('exercises')
          .select('id')
          .eq('name', exercise.name)
          .maybeSingle();

        if (exerciseError) {
          throw exerciseError;
        }

        if (exerciseData) {
          const { error: insertError } = await supabase
            .from('workout_exercises')
            .insert([{
              workout_id: workoutId,
              exercise_id: exerciseData.id,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              order_index: i
            }]);

          if (insertError) {
            throw insertError;
          }
        }
      }
    }

    console.log('Workout data seeded successfully!');
  } catch (error) {
    console.error('Error seeding workout data:', error);
    throw error;
  }
}
