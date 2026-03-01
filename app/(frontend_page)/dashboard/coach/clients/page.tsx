
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-client';

interface Client {
    id: string;
    name: string;
    email: string;
    status: string;
    lastWorkout?: string;
}

export default function ClientsPage() {
    const router = useRouter();

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'coach') {
            router.push('/auth/signin');
            return;
        }

        fetchClients();
    }, [router]);

    const fetchClients = async () => {
        try {
            const response = await fetch('/api/coach/clients');
            const data = await response.json();
            if (data.success) {
                setClients(data.clients);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredClients = clients.filter(client =>
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700 py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="text-gray-400 hover:text-white">
                            &larr; Back
                        </button>
                        <h1 className="text-2xl font-bold">Manage Clients</h1>
                    </div>
                    <button
                        onClick={() => router.push('/dashboard/coach/clients/invite')}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded font-medium"
                    >
                        + Add Client
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <input
                        type="text"
                        placeholder="Search clients..."
                        className="w-full max-w-md px-4 py-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:border-indigo-500 text-white"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-700 text-gray-300">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Email</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {filteredClients.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-gray-500">
                                        No clients found.
                                    </td>
                                </tr>
                            ) : (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="hover:bg-gray-750 transition">
                                        <td className="p-4 font-medium">{client.name}</td>
                                        <td className="p-4 text-gray-400">{client.email}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs ${client.status === 'Active' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
                                                }`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <button
                                                onClick={() => router.push(`/dashboard/coach/clients/${client.id}`)}
                                                className="text-indigo-400 hover:text-indigo-300 font-medium"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );
}
