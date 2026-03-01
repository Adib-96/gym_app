
"use client";
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-client';
import { FaTrash, FaPlus, FaSave } from 'react-icons/fa';

interface Client {
    id: string;
    name: string;
}

interface Exercise {
    id: string;
    name: string;
    muscle_group: string;
}

interface WorkoutExercise {
    exerciseId: string;
    sets: number;
    reps: number;
    weight?: number;
    notes?: string;
}

function CreateWorkoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const preSelectedClientId = searchParams.get('clientId');
    // const [user, setUser] = useState<{ role?: string } | null>(null);
    const [clients, setClients] = useState<Client[]>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [selectedClientId, setSelectedClientId] = useState('');
    const [workoutName, setWorkoutName] = useState('');
    const [description, setDescription] = useState('');
    const [scheduledDate, setScheduledDate] = useState('');
    const [addedExercises, setAddedExercises] = useState<WorkoutExercise[]>([]);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'coach') {
            router.push('/auth/signin');
            return;
        }
        // setUser(currentUser);
        fetchData();

        if (preSelectedClientId) {
            setSelectedClientId(preSelectedClientId);
        }
    }, [router, preSelectedClientId]);

    const fetchData = async () => {
        try {
            const [clientsRes, exercisesRes] = await Promise.all([
                fetch('/api/coach/clients'),
                fetch('/api/exercises')
            ]);

            const clientsData = await clientsRes.json();
            const exercisesData = await exercisesRes.json();

            if (clientsData.success) setClients(clientsData.clients);
            if (exercisesData.success) setExercises(exercisesData.exercises);

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const addExercise = () => {
        if (exercises.length === 0) return;
        setAddedExercises([
            ...addedExercises,
            { exerciseId: exercises[0].id, sets: 3, reps: 10, weight: 0, notes: '' }
        ]);
    };

    const removeExercise = (index: number) => {
        const newExercises = [...addedExercises];
        newExercises.splice(index, 1);
        setAddedExercises(newExercises);
    };

    const updateExercise = (index: number, field: keyof WorkoutExercise, value: string | number) => {
        const newExercises = [...addedExercises];
        newExercises[index] = { ...newExercises[index], [field]: value } as unknown as WorkoutExercise;
        setAddedExercises(newExercises);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClientId || !workoutName || addedExercises.length === 0) {
            alert('Please fill in all required fields and add at least one exercise.');
            return;
        }

        setSubmitting(true);
        try {
            const response = await fetch('/api/workouts/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    clientId: selectedClientId,
                    name: workoutName,
                    description,
                    scheduledDate: scheduledDate || null,
                    exercises: addedExercises
                })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            alert('Workout assigned successfully!');
            router.push('/dashboard/coach');
        } catch (error) {
            alert(error instanceof Error ? error.message : String(error));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
                >
                    &larr; Back
                </button>

                <h1 className="text-3xl font-bold mb-8">Create & Assign Workout</h1>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Workout Details */}
                    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                        <h2 className="text-xl font-semibold mb-4">Workout Details</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Client *</label>
                                <select
                                    className="w-full bg-gray-700 rounded p-2 text-white"
                                    value={selectedClientId}
                                    onChange={(e) => setSelectedClientId(e.target.value)}
                                    required
                                >
                                    <option value="">Select a client...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Scheduled Date</label>
                                <input
                                    type="date"
                                    className="w-full bg-gray-700 rounded p-2 text-white"
                                    value={scheduledDate}
                                    onChange={(e) => setScheduledDate(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Workout Name *</label>
                            <input
                                type="text"
                                className="w-full bg-gray-700 rounded p-2 text-white"
                                value={workoutName}
                                onChange={(e) => setWorkoutName(e.target.value)}
                                required
                                placeholder="e.g., Upper Body Power"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                            <textarea
                                className="w-full bg-gray-700 rounded p-2 text-white h-24"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Instructions, goals, etc."
                            />
                        </div>
                    </div>

                    {/* Exercises */}
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-semibold">Exercises</h2>
                            <button
                                type="button"
                                onClick={addExercise}
                                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-medium"
                            >
                                <FaPlus /> Add Exercise
                            </button>
                        </div>

                        {addedExercises.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No exercises added yet.</p>
                        ) : (
                            <div className="space-y-4">
                                {addedExercises.map((exercise, index) => (
                                    <div key={index} className="bg-gray-750 p-4 rounded border border-gray-700">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex-1 mr-4">
                                                <label className="block text-xs text-gray-500 mb-1">Exercise</label>
                                                <select
                                                    className="w-full bg-gray-700 rounded p-2 text-white"
                                                    value={exercise.exerciseId}
                                                    onChange={(e) => updateExercise(index, 'exerciseId', e.target.value)}
                                                >
                                                    {exercises.map(ex => (
                                                        <option key={ex.id} value={ex.id}>{ex.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeExercise(index)}
                                                className="text-red-400 hover:text-red-300 p-2"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-3 gap-4 mb-3">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Sets</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-gray-700 rounded p-2 text-white"
                                                    value={exercise.sets}
                                                    onChange={(e) => updateExercise(index, 'sets', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Reps</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-gray-700 rounded p-2 text-white"
                                                    value={exercise.reps}
                                                    onChange={(e) => updateExercise(index, 'reps', parseInt(e.target.value))}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Weight (kg)</label>
                                                <input
                                                    type="number"
                                                    className="w-full bg-gray-700 rounded p-2 text-white"
                                                    value={exercise.weight}
                                                    onChange={(e) => updateExercise(index, 'weight', parseFloat(e.target.value))}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Notes</label>
                                            <input
                                                type="text"
                                                className="w-full bg-gray-700 rounded p-2 text-white"
                                                value={exercise.notes}
                                                onChange={(e) => updateExercise(index, 'notes', e.target.value)}
                                                placeholder="Specific instructions for this exercise"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-bold text-lg flex items-center gap-2 disabled:opacity-50"
                        >
                            <FaSave /> {submitting ? 'Assigning...' : 'Assign Workout'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CreateWorkoutPage() {
    return (
        <Suspense fallback={<div className="p-8 text-white min-h-screen bg-gray-900">Loading workout creation system...</div>}>
            <CreateWorkoutContent />
        </Suspense>
    );
}
