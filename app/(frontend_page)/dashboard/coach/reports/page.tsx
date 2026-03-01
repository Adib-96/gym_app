"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-client';

interface ReportStats {
    totalAssigned: number;
    totalCompleted: number;
    weeklyCompleted: number;
    completionRate: number;
    clientProgress: {
        name: string;
        completed: number;
        assigned: number;
        rate: number;
    }[];
}

export default function CoachReports() {
    const router = useRouter();
    // const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<ReportStats | null>(null);

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser || currentUser.role !== 'coach') {
            router.push('/auth/signin');
            return;
        }
        // setUser(currentUser);
        fetchReportData();
    }, [router]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/coach/reports');
            const data = await res.json();

            if (data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadCSV = () => {
        if (!stats) return;

        const headers = ['Client Name', 'Workouts Completed', 'Workouts Assigned', 'Completion Rate (%)'];
        const rows = stats.clientProgress.map(c => [c.name, c.completed, c.assigned, c.rate]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "coach_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white p-8">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                        <p className="mt-4 text-gray-400">Generating reports...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <header className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <button
                                onClick={() => router.push('/dashboard/coach')}
                                className="mr-4 text-gray-400 hover:text-white"
                            >
                                ← Back
                            </button>
                            <h1 className="text-xl font-bold">GymTracker</h1>
                        </div>
                        <div className="text-gray-300">Coach Reports</div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 bg-gradient-to-r from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 shadow-xl">
                    <div>
                        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            Performance Analytics
                        </h1>
                        <p className="mt-2 text-gray-400 text-lg">
                            Track client consistency and workout completion milestones.
                        </p>
                    </div>
                    <button
                        onClick={handleDownloadCSV}
                        className="group flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                    >
                        <span>Download CSV Report</span>
                        <svg className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                    </button>
                </div>

                {/* Top Level Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-indigo-500/50 transition-all">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Workouts</h3>
                        <p className="text-4xl font-black mt-2">{stats?.totalAssigned}</p>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Lifetime assigned</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-green-500/50 transition-all">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total Completed</h3>
                        <p className="text-4xl font-black mt-2 text-green-400">{stats?.totalCompleted}</p>
                        <div className="mt-4 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-green-500 h-2 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                                style={{ width: `${stats?.completionRate}%` }}
                            ></div>
                        </div>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-amber-500/50 transition-all border-l-4 border-l-amber-500">
                        <h3 className="text-amber-500 text-xs font-bold uppercase tracking-widest">Last 7 Days</h3>
                        <p className="text-4xl font-black mt-2">{stats?.weeklyCompleted}</p>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Workouts finished</p>
                    </div>

                    <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg hover:border-indigo-500/50 transition-all">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest">Success Rate</h3>
                        <p className="text-4xl font-black mt-2 text-indigo-400">{stats?.completionRate}%</p>
                        <p className="text-gray-500 text-sm mt-1 font-medium">Overall consistency</p>
                    </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-2xl">
                    <div className="p-6 border-b border-gray-700 bg-gray-750 flex justify-between items-center">
                        <h2 className="text-xl font-bold">Client Performance Breakdown</h2>
                        <span className="text-xs text-gray-400 italic">Sorted by completion rate</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-widest">
                                <tr>
                                    <th className="px-6 py-5">Client Name</th>
                                    <th className="px-6 py-5">Completed</th>
                                    <th className="px-6 py-5">Assigned</th>
                                    <th className="px-6 py-5">Success Rate</th>
                                    <th className="px-6 py-5 min-w-[200px]">Progress Visual</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {!stats || stats.clientProgress.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                            <p className="text-lg">No workout data available yet.</p>
                                            <p className="text-sm mt-1">Assign workouts to your clients to see analytics here.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    stats.clientProgress.map((client, idx) => (
                                        <tr key={idx} className="hover:bg-gray-750 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                                                    {client.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-300">{client.completed}</td>
                                            <td className="px-6 py-4 text-gray-300">{client.assigned}</td>
                                            <td className="px-6 py-4">
                                                <span className={`font-bold ${client.rate >= 80 ? 'text-green-400' :
                                                    client.rate >= 50 ? 'text-yellow-400' : 'text-red-400'
                                                    }`}>
                                                    {client.rate}%
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                                        <div
                                                            className={`h-2.5 rounded-full transition-all duration-1000 ${client.rate >= 80 ? 'bg-green-500' :
                                                                client.rate >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${client.rate}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}
