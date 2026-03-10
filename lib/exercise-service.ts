import supabase from "./supabase-server";

interface Muscle {
  id: string;
  code: string;
  name: string;
}

interface ExerciseType {
  id: string;
  code: string;
  name: string;
}

interface Category {
  id: string;
  code: string;
  name: string;
}

interface ApiExercise {
  id: string;
  code?: string; // Make code optional
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  types: ExerciseType[];
  categories: Category[];
  name: string;
  description: string;
}

interface Exercise {
  id: string;
  name: string;
  description: string;
  muscleGroup: string;
  equipment: string[];
  exerciseCode: string | null; // Add this
}

async function fetchExercises(): Promise<Exercise[]> {
  const response = await fetch('https://api.workoutapi.com/exercises', {
    headers: {
      'X-API-Key': process.env.API_KEY || ''
    }
  });

  if (!response.ok) {
    throw new Error(`Error fetching exercises: ${response.statusText}`);
  }

  const apiExercises: ApiExercise[] = await response.json();

  // Transform API data
  const exercises: Exercise[] = apiExercises.map(exercise => ({
    id: exercise.id,
    name: exercise.name,
    description: exercise.description,
    // Take the first primary muscle name, or empty string if none
    muscleGroup: exercise.primaryMuscles[0]?.name || '',
    // Extract category names as equipment
    equipment: exercise.categories.map(category => category.name),
    // Use exercise.code or fallback to name slug if code is missing
    exerciseCode: exercise.code || exercise.name.toLowerCase().replace(/\s+/g, '_').replace(/[^\w\s]/gi, '')
  }));

  for (const exercise of exercises) {
    try {
      const { error } = await supabase
        .from('exercises')
        .upsert([{
          id: exercise.id,
          name: exercise.name,
          description: exercise.description,
          muscle_group: exercise.muscleGroup,
          equipment: exercise.equipment,
          exercise_id: exercise.exerciseCode
        }], {
          onConflict: 'id'
        });

      if (error) {
        console.error(`Error inserting exercise ${exercise.name}:`, error);
        console.log('Problematic exercise data:', {
          id: exercise.id,
          name: exercise.name,
          exerciseCode: exercise.exerciseCode
        });
      }
    } catch (error) {
      console.error(`Error inserting exercise ${exercise.name}:`, error);
      console.log('Problematic exercise data:', {
        id: exercise.id,
        name: exercise.name,
        exerciseCode: exercise.exerciseCode
      });
    }
  }

  return exercises;
}

export default fetchExercises;