"use client";
import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Workout } from '@/lib/workouts-service';
import { Play, CheckCircle2, Clock, Trash2, Plus, ChevronRight, X } from 'lucide-react';

interface WorkoutLoggingModalProps {
  isOpen: boolean;
  workout: Workout | null;
  onClose: () => void;
  onComplete: () => void;
}

interface SetLog {
  reps: number;
  weight: number;
  completed: boolean;
}

export default function WorkoutLoggingModal({
  isOpen,
  workout,
  onClose,
  onComplete,
}: WorkoutLoggingModalProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [exerciseSets, setExerciseSets] = useState<Record<number, SetLog[]>>({});
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [currentRpe, setCurrentRpe] = useState(7);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize timer logic
  useEffect(() => {
    if (sessionId && !timerRef.current) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [sessionId]);

  // Initialize sets for current exercise if they don't exist
  useEffect(() => {
    if (workout && !exerciseSets[currentExerciseIndex]) {
      const exercise = workout.exercises[currentExerciseIndex];
      const initialSets: SetLog[] = Array.from({ length: exercise.sets || 3 }, () => ({
        reps: exercise.reps || 10,
        weight: exercise.weight || 0,
        completed: false
      }));
      setExerciseSets(prev => ({ ...prev, [currentExerciseIndex]: initialSets }));
    }
  }, [currentExerciseIndex, workout, exerciseSets]);

  if (!isOpen || !workout) return null;

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentSets = exerciseSets[currentExerciseIndex] || [];

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs > 0 ? hrs + ':' : ''}${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workouts/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutId: workout.id,
          notes: `Started session: ${workout.name}`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initialize session');
      }
      const data = await response.json();
      setSessionId(data.data.id);
    } catch (error) {
      console.error('Session Init Error:', error);
      alert(error instanceof Error ? error.message : 'Initialization failed');
    } finally {
      setLoading(false);
    }
  };

  const toggleSetStatus = (idx: number) => {
    const updated = [...currentSets];
    updated[idx].completed = !updated[idx].completed;
    setExerciseSets(prev => ({ ...prev, [currentExerciseIndex]: updated }));
  };

  const updateSet = (idx: number, field: keyof SetLog, value: number | boolean) => {
    const updated = [...currentSets];
    updated[idx] = { ...updated[idx], [field]: value } as unknown as SetLog;
    setExerciseSets(prev => ({ ...prev, [currentExerciseIndex]: updated }));
  };

  const addSet = () => {
    const lastSet = currentSets[currentSets.length - 1] || { reps: 10, weight: 0, completed: false };
    setExerciseSets(prev => ({
      ...prev,
      [currentExerciseIndex]: [...currentSets, { ...lastSet, completed: false }]
    }));
  };

  const removeSet = (idx: number) => {
    if (currentSets.length <= 1) return;
    const updated = currentSets.filter((_, i) => i !== idx);
    setExerciseSets(prev => ({ ...prev, [currentExerciseIndex]: updated }));
  };

  const logCurrentExercise = async () => {
    if (!sessionId) return;

    // Aggregation logic for current database schema
    const completedSets = currentSets.filter(s => s.completed);
    if (completedSets.length === 0) {
      alert("Please complete at least one set before continuing.");
      return;
    }

    const bestSet = completedSets.reduce((prev, curr) =>
      (curr.reps * curr.weight) > (prev.reps * prev.weight) ? curr : prev
    );

    try {
      setLoading(true);
      const response = await fetch(`/api/workouts/sessions/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workoutExerciseId: currentExercise.id,
          setsCompleted: completedSets.length,
          repsCompleted: bestSet.reps,
          weightUsed: bestSet.weight,
          rpe: currentRpe,
          notes: notes,
        }),
      });

      if (!response.ok) throw new Error('Failed to log movement');

      if (currentExerciseIndex < workout.exercises.length - 1) {
        setNotes('');
        setCurrentRpe(7);
        setCurrentExerciseIndex(currentExerciseIndex + 1);
      } else {
        completeWorkout();
      }
    } catch {
      alert('Logging Error');
    } finally {
      setLoading(false);
    }
  };

  const completeWorkout = async () => {
    if (!sessionId) return;
    try {
      setLoading(true);
      const durationMinutes = Math.round(elapsedTime / 60);
      const response = await fetch(`/api/workouts/sessions/${sessionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complete: true,
          durationMinutes,
          notes: 'Evolution Flow Milestone Achieved',
        }),
      });
      if (response.ok) {
        onComplete();
        onClose();
      }
    } catch {
      alert('Completion Error');
    } finally {
      setLoading(false);
    }
  };

  const exerciseProgress = ((currentExerciseIndex + 1) / workout.exercises.length) * 100;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="p-8 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] -mr-20 -mt-20"></div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter">{workout.name}</h2>
              <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">Live Telemetry Phase</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-800 rounded-xl transition-colors text-gray-400">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
            {!sessionId ? (
              <div className="flex flex-col items-center py-12 text-center">
                <div className="w-24 h-24 rounded-[2rem] bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-8 rotate-3 shadow-2xl">
                  <Play className="text-indigo-400 fill-indigo-400" size={32} />
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-4">Initialize Performance</h3>
                <p className="text-gray-400 max-w-sm mb-12 font-medium leading-relaxed">
                  {workout.description || 'Prepare for high-intensity movement validation. All telemetry will be captured live.'}
                </p>
                <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-12">
                  <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800">
                    <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Movements</span>
                    <span className="text-xl font-black text-white">{workout.exerciseCount}</span>
                  </div>
                  <div className="bg-gray-950/50 p-4 rounded-2xl border border-gray-800">
                    <span className="text-[10px] font-black text-gray-500 uppercase block mb-1">Target Duration</span>
                    <span className="text-xl font-black text-white">{workout.totalDuration} Min</span>
                  </div>
                </div>
                <button
                  onClick={startWorkout}
                  disabled={loading}
                  className="w-full max-w-md py-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black tracking-widest uppercase text-sm shadow-2xl shadow-indigo-600/20 transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'CALIBRATING...' : 'INITIATE SESSION'}
                </button>
              </div>
            ) : (
              <motion.div
                key={currentExerciseIndex}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="space-y-8"
              >
                {/* Exercise Info */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="px-3 py-1 bg-gray-800 rounded-lg text-[10px] font-black text-indigo-400 uppercase tracking-widest border border-gray-700">Movement {currentExerciseIndex + 1}</span>
                      <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{currentExercise?.muscleGroup}</span>
                    </div>
                    <h3 className="text-3xl font-black text-white tracking-tighter leading-tight">{currentExercise?.exerciseName}</h3>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 text-indigo-400 mb-1">
                      <Clock size={16} />
                      <span className="text-xl font-black tracking-tighter tabular-nums">{formatTime(elapsedTime)}</span>
                    </div>
                    <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active Time</span>
                  </div>
                </div>

                {/* Set Tracker */}
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 px-4">
                    <div className="col-span-2 text-[10px] font-black text-gray-600 uppercase">Set</div>
                    <div className="col-span-4 text-[10px] font-black text-gray-600 uppercase">Weight (KG)</div>
                    <div className="col-span-4 text-[10px] font-black text-gray-600 uppercase">Reps</div>
                    <div className="col-span-2"></div>
                  </div>

                  {currentSets.map((s, idx) => (
                    <motion.div
                      key={idx}
                      className={`grid grid-cols-12 gap-4 items-center p-2 rounded-2xl border transition-all ${s.completed ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-gray-950/50 border-gray-800'
                        }`}
                    >
                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => toggleSetStatus(idx)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${s.completed ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-gray-700 text-transparent'
                            }`}
                        >
                          <CheckCircle2 size={16} className={s.completed ? 'opacity-100' : 'opacity-0'} />
                        </button>
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          value={s.weight}
                          onChange={(e) => updateSet(idx, 'weight', parseFloat(e.target.value))}
                          className="w-full bg-gray-900/50 text-white font-black text-lg p-3 rounded-xl border border-gray-800 focus:border-indigo-500 outline-none text-center"
                        />
                      </div>
                      <div className="col-span-4">
                        <input
                          type="number"
                          value={s.reps}
                          onChange={(e) => updateSet(idx, 'reps', parseInt(e.target.value))}
                          className="w-full bg-gray-900/50 text-white font-black text-lg p-3 rounded-xl border border-gray-800 focus:border-indigo-500 outline-none text-center"
                        />
                      </div>
                      <div className="col-span-2 flex justify-center">
                        <button
                          onClick={() => removeSet(idx)}
                          className="p-2 text-gray-600 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </motion.div>
                  ))}

                  <button
                    onClick={addSet}
                    className="w-full py-4 border-2 border-dashed border-gray-800 rounded-2xl text-gray-500 font-black text-xs uppercase tracking-widest hover:border-indigo-500/50 hover:text-indigo-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus size={16} /> Add Performance Block
                  </button>
                </div>

                {/* Footer Inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Estimated Effort (RPE)</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={currentRpe}
                        onChange={(e) => setCurrentRpe(parseInt(e.target.value))}
                        className="flex-1 accent-indigo-500"
                      />
                      <span className="text-xl font-black text-indigo-400 w-12 text-center">{currentRpe}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-3 block">Technical Notes</label>
                    <input
                      type="text"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Enter movement feedback..."
                      className="w-full bg-gray-950/50 border border-gray-800 text-white p-3 rounded-xl text-xs font-bold outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer Navigation */}
          {sessionId && (
            <div className="p-8 bg-gray-950 border-t border-gray-800 space-y-6">
              <div className="flex items-center justify-between gap-6">
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    <span>Flow Completion</span>
                    <span>{Math.round(exerciseProgress)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-900 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${exerciseProgress}%` }}
                      className="h-full bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"
                    />
                  </div>
                </div>
                <button
                  onClick={logCurrentExercise}
                  disabled={loading}
                  className="px-10 py-5 bg-white text-gray-950 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-500 hover:text-white transition-all shadow-xl active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'PROCESSING...' : (currentExerciseIndex < workout.exercises.length - 1 ? 'NEXT MOVEMENT' : 'VALIDATE SESSION')}
                  {!loading && <ChevronRight size={18} />}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
