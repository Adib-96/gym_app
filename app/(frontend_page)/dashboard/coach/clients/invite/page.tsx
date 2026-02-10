
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-client';
import { FaPaperPlane } from 'react-icons/fa';

export default function InviteClientPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch('/api/coach/clients', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to invite client');
            }

            setMessage('Client invited successfully!');
            setEmail('');
            // Optional: Redirect after a delay
            setTimeout(() => router.push('/dashboard/coach/clients'), 2000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-md mx-auto mt-12 bg-gray-800 p-8 rounded-lg shadow-lg">
                <button
                    onClick={() => router.back()}
                    className="mb-6 text-gray-400 hover:text-white flex items-center gap-2"
                >
                    &larr; Back
                </button>

                <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <FaPaperPlane className="text-indigo-500" />
                    Invite Client
                </h1>

                <p className="text-gray-400 mb-6">
                    Enter the email address of the user you want to add as a client. They must already have an account.
                </p>

                {message && (
                    <div className="mb-4 p-3 bg-green-900 text-green-200 rounded border border-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-4 p-3 bg-red-900 text-red-200 rounded border border-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={handleInvite}>
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Client Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-indigo-500"
                            placeholder="john@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded font-semibold transition disabled:opacity-50"
                    >
                        {loading ? 'Sending Invite...' : 'Send Invitation'}
                    </button>
                </form>
            </div>
        </div>
    );
}
