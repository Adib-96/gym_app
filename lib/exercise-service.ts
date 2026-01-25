import { writeFile } from "node:fs/promises";
import { query } from "./db";

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
    

  // Updated insert query to include exercise_id column
  const insertQuery = `
    INSERT INTO exercises (id, name, description, muscle_group, equipment, exercise_id)
    VALUES ($1, $2, $3, $4, $5, $6) 
    ON CONFLICT (id) DO NOTHING
  `;

  for (const exercise of exercises) {
    try {
      await query(insertQuery, [
        exercise.id,
        exercise.name,
        exercise.description,
        exercise.muscleGroup,
        JSON.stringify(exercise.equipment),
        exercise.exerciseCode // This is the exercise_id column
      ]);
    } catch (error) {
      console.error(`Error inserting exercise ${exercise.name}:`, error);
      // If you want to see which values are causing the issue:
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