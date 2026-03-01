
"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-client';
import MessageModal from '@/components/MessageModal';

interface ClientDetails {
    id: string;
    name: string;
    email: string;
    date_of_birth: string;
    gender: string;
    height: string;
    weight: string;
    fitness_level: string;
    goals: string;
    status: string;
    created_at: string;
    user_id: string;
    stats: {
        totalWorkoutsCompleted: number;
        completionRate: number;
        averageWorkoutTime: number;
    };
}

export default function ClientDetailsPage() {
    const router = useRouter();
    const params = useParams();

    const [client, setClient] = useState<ClientDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

    // Edit form state
    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        fitness_level: '',
        goals: '',
        status: ''
    });

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'coach') {
            router.push('/auth/signin');
            return;
        }
        if (params.clientId) {
            fetchClientDetails(params.clientId as string);
        }
    }, [router, params.clientId]);

    const fetchClientDetails = async (id: string) => {
        try {
            setLoading(true);
            const response = await fetch(`/api/coach/clients/${id}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch client details');
            }

            setClient(data.client);
            setFormData({
                height: data.client.height || '',
                weight: data.client.weight || '',
                fitness_level: data.client.fitness_level || '',
                goals: data.client.goals || '',
                status: data.client.status || 'Active'
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateClient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!client) return;

        try {
            const response = await fetch(`/api/coach/clients/${client.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error);

            setClient({ ...client, ...data.client });
            setIsEditing(false);
        } catch (err) {
            alert(err instanceof Error ? err.message : String(err));
        }
    };

    const handleAssignWorkout = () => {
        if (!client) return;
        router.push(`/dashboard/coach/workouts/create?clientId=${client.id}`);
    };

    const handleMessageClient = () => {
        setIsMessageModalOpen(true);
    };

    if (loading) return <div className="p-8 text-white">Loading...</div>;
    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    if (!client) return <div className="p-8 text-white">Client not found</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
                >
                    &larr; Back to Clients
                </button>

                <div className="bg-gray-800 rounded-lg p-6 mb-6">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold">{client.name}</h1>
                            <p className="text-gray-400">{client.email}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
                        >
                            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                        </button>
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleUpdateClient} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Height (cm)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-700 rounded p-2 text-white"
                                        value={formData.height}
                                        onChange={e => setFormData({ ...formData, height: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Weight (kg)</label>
                                    <input
                                        type="number"
                                        className="w-full bg-gray-700 rounded p-2 text-white"
                                        value={formData.weight}
                                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Fitness Level</label>
                                    <select
                                        className="w-full bg-gray-700 rounded p-2 text-white"
                                        value={formData.fitness_level}
                                        onChange={e => setFormData({ ...formData, fitness_level: e.target.value })}
                                    >
                                        <option value="">Select Level</option>
                                        <option value="Beginner">Beginner</option>
                                        <option value="Intermediate">Intermediate</option>
                                        <option value="Advanced">Advanced</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                                    <select
                                        className="w-full bg-gray-700 rounded p-2 text-white"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                        <option value="Pending">Pending</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Goals</label>
                                <textarea
                                    className="w-full bg-gray-700 rounded p-2 text-white h-24"
                                    value={formData.goals}
                                    onChange={e => setFormData({ ...formData, goals: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end pt-4">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded font-medium"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-gray-750 p-4 rounded">
                                <p className="text-sm text-gray-400">Status</p>
                                <p className="text-xl font-semibold">{client.status}</p>
                            </div>
                            <div className="bg-gray-750 p-4 rounded">
                                <p className="text-sm text-gray-400">Fitness Level</p>
                                <p className="text-xl font-semibold">{client.fitness_level || 'Not set'}</p>
                            </div>
                            <div className="bg-gray-750 p-4 rounded">
                                <p className="text-sm text-gray-400">Height / Weight</p>
                                <p className="text-xl font-semibold">
                                    {client.height ? `${client.height}cm` : '-'} / {client.weight ? `${client.weight}kg` : '-'}
                                </p>
                            </div>
                            <div className="bg-gray-750 p-4 rounded">
                                <p className="text-sm text-gray-400">Goals</p>
                                <p className="text-sm mt-1">{client.goals || 'No specific goals set'}</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Workouts Completed</h3>
                        <p className="text-3xl font-bold mt-2">{client.stats.totalWorkoutsCompleted}</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Completion Rate</h3>
                        <p className="text-3xl font-bold mt-2">{client.stats.completionRate}%</p>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg">
                        <h3 className="text-gray-400 text-sm font-medium">Avg. Duration</h3>
                        <p className="text-3xl font-bold mt-2">{client.stats.averageWorkoutTime} min</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
                    <button
                        onClick={handleAssignWorkout}
                        className="p-4 bg-gray-800 hover:bg-gray-750 rounded-lg text-left transition group"
                    >
                        <h3 className="font-semibold text-lg group-hover:text-indigo-400">Assign Workout</h3>
                        <p className="text-gray-400 text-sm mt-1">Create or assign a workout plan</p>
                    </button>
                    <button
                        onClick={handleMessageClient}
                        className="p-4 bg-gray-800 hover:bg-gray-750 rounded-lg text-left transition group"
                    >
                        <h3 className="font-semibold text-lg group-hover:text-indigo-400">Message Client</h3>
                        <p className="text-gray-400 text-sm mt-1">Send a direct message</p>
                    </button>
                </div>

                {/* Message Modal */}
                {client && (
                    <MessageModal
                        isOpen={isMessageModalOpen}
                        onClose={() => setIsMessageModalOpen(false)}
                        receiverId={client.user_id}
                        receiverName={client.name}
                    />
                )}

            </div>
        </div>
    );
}
