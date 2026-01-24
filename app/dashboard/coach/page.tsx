"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth-client';

export default function CoachDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (!currentUser || currentUser.role !== 'coach') {
      router.push('/auth/signin');
      return;
    }

    setUser(currentUser);
    fetchClients();
    setLoading(false);
  }, [router]);

  const fetchClients = async () => {
    try {
      // For now, use mock data
      setClients([
        { id: 1, name: 'John Doe', email: 'john@example.com', status: 'Active', lastWorkout: '2 days ago' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'Active', lastWorkout: 'Yesterday' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', status: 'Inactive', lastWorkout: '1 week ago' },
      ]);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">GymTracker</h1>
              <span className="ml-4 px-3 py-1 bg-purple-600 rounded-full text-xs">
                Coach
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, Coach {user.name}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Coach Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Manage your clients, create workouts, and track progress.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Total Clients</h3>
            <p className="text-3xl font-bold mt-2">{clients.length}</p>
            <p className="text-gray-400 text-sm mt-1">Active: {clients.filter(c => c.status === 'Active').length}</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Active Workouts</h3>
            <p className="text-3xl font-bold mt-2">12</p>
            <p className="text-gray-400 text-sm mt-1">This week</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Completion Rate</h3>
            <p className="text-3xl font-bold mt-2">92%</p>
            <p className="text-gray-400 text-sm mt-1">Client average</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">New Messages</h3>
            <p className="text-3xl font-bold mt-2">3</p>
            <p className="text-gray-400 text-sm mt-1">Unread</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Clients */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Clients</h2>
                <button 
                  onClick={() => router.push('/clients')}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded"
                >
                  Manage Clients
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-700">
                    <tr>
                      <th className="p-4 text-left">Client</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Last Workout</th>
                      <th className="p-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="border-t border-gray-700 hover:bg-gray-750">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{client.name}</p>
                            <p className="text-sm text-gray-400">{client.email}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${
                            client.status === 'Active' 
                              ? 'bg-green-900 text-green-200' 
                              : 'bg-yellow-900 text-yellow-200'
                          }`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400">{client.lastWorkout}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                              View
                            </button>
                            <button className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                              Message
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <div>
                    <p>John Doe completed "Full Body Strength" workout</p>
                    <p className="text-sm text-gray-400">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <div>
                    <p>Jane Smith started a new workout plan</p>
                    <p className="text-sm text-gray-400">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <div>
                    <p>Bob Johnson sent a progress update</p>
                    <p className="text-sm text-gray-400">2 days ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => router.push('/workouts/create')}
                  className="w-full p-3 bg-indigo-600 hover:bg-indigo-700 rounded text-left"
                >
                  <p className="font-medium">Create Workout</p>
                  <p className="text-sm text-gray-300">Design new workout plan</p>
                </button>
                <button 
                  onClick={() => router.push('/clients/invite')}
                  className="w-full p-3 bg-green-600 hover:bg-green-700 rounded text-left"
                >
                  <p className="font-medium">Invite Client</p>
                  <p className="text-sm text-gray-300">Send invitation to new client</p>
                </button>
                <button 
                  onClick={() => router.push('/progress/reports')}
                  className="w-full p-3 bg-purple-600 hover:bg-purple-700 rounded text-left"
                >
                  <p className="font-medium">Generate Reports</p>
                  <p className="text-sm text-gray-300">Client progress reports</p>
                </button>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Today's Schedule</h3>
              <div className="space-y-4">
                <div className="p-3 bg-gray-700 rounded">
                  <p className="font-medium">Session with John</p>
                  <p className="text-sm text-gray-400">10:00 AM - 11:00 AM</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">
                    Confirmed
                  </span>
                </div>
                <div className="p-3 bg-gray-700 rounded">
                  <p className="font-medium">Progress Review</p>
                  <p className="text-sm text-gray-400">2:00 PM - 3:00 PM</p>
                  <span className="inline-block mt-2 px-2 py-1 bg-green-900 text-green-200 rounded text-xs">
                    Online
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Client Satisfaction</span>
                    <span className="text-sm">94%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Workout Completion</span>
                    <span className="text-sm">88%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Client Retention</span>
                    <span className="text-sm">96%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}