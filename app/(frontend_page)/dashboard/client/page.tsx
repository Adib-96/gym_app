"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth-client';

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
      router.push('/signin');
      return;
    }

    setUser(currentUser);
    setLoading(false);
  }, [router]);

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
              <span className="ml-4 px-3 py-1 bg-indigo-600 rounded-full text-xs">
                Client
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300">Welcome, {user.name}!</span>
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
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <p className="mt-2 text-gray-400">
            Track your workouts, progress, and connect with your coach.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Active Workouts</h3>
            <p className="text-3xl font-bold mt-2">3</p>
            <p className="text-gray-400 text-sm mt-1">Currently assigned</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Workout Completion</h3>
            <p className="text-3xl font-bold mt-2">87%</p>
            <p className="text-gray-400 text-sm mt-1">This month</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold">Next Workout</h3>
            <p className="text-3xl font-bold mt-2">Tomorrow</p>
            <p className="text-gray-400 text-sm mt-1">Full Body Circuit</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Workouts */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Your Workouts</h2>
                <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {/* Workout Card 1 */}
                <div className="bg-gray-700 rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Full Body Strength</h3>
                      <p className="text-sm text-gray-400 mt-1">5 exercises • 45 minutes</p>
                    </div>
                    <span className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-xs">
                      Active
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm">Assigned: 2 days ago</span>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                      Start Workout
                    </button>
                  </div>
                </div>

                {/* Workout Card 2 */}
                <div className="bg-gray-700 rounded p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">Cardio Blast</h3>
                      <p className="text-sm text-gray-400 mt-1">4 exercises • 30 minutes</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-900 text-yellow-200 rounded-full text-xs">
                      Pending
                    </span>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm">Assigned: Today</span>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Section */}
            <div className="mt-6 bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Progress Tracking</h2>
              <div className="h-64 flex items-center justify-center bg-gray-900 rounded">
                <p className="text-gray-500">Progress charts will appear here</p>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Coach Info */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Your Coach</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="font-bold">C</span>
                </div>
                <div className="ml-4">
                  <p className="font-medium">Coach Alex</p>
                  <p className="text-sm text-gray-400">Certified Personal Trainer</p>
                </div>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded">
                Message Coach
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Total Workouts Completed</p>
                  <p className="text-xl font-bold">24</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="text-xl font-bold">7 days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg. Workout Time</p>
                  <p className="text-xl font-bold">42 min</p>
                </div>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Upcoming Schedule</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Morning Workout</p>
                    <p className="text-sm text-gray-400">Tomorrow • 8:00 AM</p>
                  </div>
                  <span className="px-2 py-1 bg-blue-900 text-blue-200 rounded text-xs">
                    Confirmed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Progress Check</p>
                    <p className="text-sm text-gray-400">Friday • 3:00 PM</p>
                  </div>
                  <span className="px-2 py-1 bg-yellow-900 text-yellow-200 rounded text-xs">
                    Pending
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}