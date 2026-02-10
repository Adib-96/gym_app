"use client";
import { useState } from 'react';
import { Workout, WorkoutExercise } from '@/lib/workouts-service';

interface WorkoutLoggingModalProps {
  isOpen: boolean;
  workout: Workout | null;
  onClose: () => void;
  onComplete: () => void;
}

export default function WorkoutLoggingModal({
  isOpen,
  workout,
  onClose,
  onComplete,
}: WorkoutLoggingModalProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime] = useState(new Date());
  const [exerciseLogs, setExerciseLogs] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen || !workout) return null;

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentLog = exerciseLogs[currentExerciseIndex] || {
    sets: currentExercise?.sets || 0,
    reps: currentExercise?.reps || 0,
    weight: currentExercise?.weight || 0,
    rpe: 5,
  };

  const startWorkout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workouts/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId: workout.id,
          notes: `Started workout: ${workout.name}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to start workout');
      }
      const data = await response.json();
      console.log('Workout session created:', data.data);
      
      if (!data.data?.id) {
        throw new Error('No session ID returned from server');
      }
      
      setSessionId(data.data.id);
    } catch (error) {
      console.error('Error starting workout:', error);
      alert(error instanceof Error ? error.message : 'Failed to start workout');
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseLog = (field: string, value: any) => {
    setExerciseLogs({
      ...exerciseLogs,
      [currentExerciseIndex]: {
        ...currentLog,
        [field]: value,
      },
    });
  };

  const logCurrentExercise = async () => {
    if (!sessionId) {
      alert('Workout session not initialized. Please start the workout again.');
      return;
    }

    try {
      setLoading(true);
      console.log('Logging exercise with sessionId:', sessionId);
      
      const response = await fetch(`/api/workouts/sessions/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutExerciseId: workout.exercises[currentExerciseIndex].id,
          setsCompleted: currentLog.sets,
          repsCompleted: currentLog.reps,
          weightUsed: currentLog.weight,
          rpe: currentLog.rpe,
          notes: currentLog.notes,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to log exercise');
      }
      
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        // All exercises logged, complete workout
        completeWorkout();
      }
    } catch (error) {
      console.error('Error logging exercise:', error);
      alert(error instanceof Error ? error.message : 'Failed to log exercise');
    } finally {
      setLoading(false);
    }
  };

  const completeWorkout = async () => {
    if (!sessionId) return;

    try {
      setLoading(true);
      const endTime = new Date();
      const durationMinutes = Math.round((endTime.getTime() - startTime.getTime()) / 60000);

      const response = await fetch(`/api/workouts/sessions/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complete: true,
          durationMinutes,
          notes: 'Workout completed successfully',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to complete workout');
      }
      
      onComplete();
      onClose();
    } catch (error) {
      console.error('Error completing workout:', error);
      alert(error instanceof Error ? error.message : 'Failed to complete workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-8 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
          {sessionId && (
            <span className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-xs">
              In Progress
            </span>
          )}
        </div>

        {!sessionId ? (
          <div className="text-center">
            <p className="text-gray-300 mb-6">{workout.description}</p>
            <p className="text-gray-400 mb-6">{workout.exerciseCount} exercises • {workout.totalDuration} minutes</p>
            <button
              onClick={startWorkout}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? 'Starting...' : 'Start Workout'}
            </button>
          </div>
        ) : (
          <div>
            {/* Exercise Card */}
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">
                  Exercise {currentExerciseIndex + 1} of {workout.exercises.length}
                </p>
                <h3 className="text-xl font-bold text-white">{currentExercise?.exerciseName}</h3>
                <p className="text-sm text-gray-400 mt-1">{currentExercise?.muscleGroup}</p>
              </div>

              {/* Logging Fields */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Sets</label>
                  <input
                    type="number"
                    value={currentLog.sets}
                    onChange={(e) => updateExerciseLog('sets', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Reps</label>
                  <input
                    type="number"
                    value={currentLog.reps}
                    onChange={(e) => updateExerciseLog('reps', parseInt(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={currentLog.weight}
                    onChange={(e) => updateExerciseLog('weight', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-300 mb-2">RPE (1-10)</label>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={currentLog.rpe}
                    onChange={(e) => updateExerciseLog('rpe', parseInt(e.target.value))}
                    className="w-full"
                  />
                  <span className="text-sm text-gray-400">{currentLog.rpe}/10</span>
                </div>
              </div>

              <textarea
                value={currentLog.notes || ''}
                onChange={(e) => updateExerciseLog('notes', e.target.value)}
                placeholder="Notes (optional)"
                className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-500 mb-6"
                rows={2}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white"
              >
                Cancel
              </button>
              <button
                onClick={logCurrentExercise}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? 'Logging...' : currentExerciseIndex < workout.exercises.length - 1 ? 'Next Exercise' : 'Finish Workout'}
              </button>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="w-full bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{
                    width: `${((currentExerciseIndex + 1) / workout.exercises.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
