"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth-client';
import WorkoutLoggingModal from '@/components/WorkoutLoggingModal';
import ProgressCharts from '@/components/ProgressCharts';
import WorkoutHistory from '@/components/WorkoutHistory';

interface WorkoutExercise {
  id: string;
  exerciseName: string;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number;
  muscleGroup: string;
  description: string;
}

interface Workout {
  id: string;
  clientId: string;
  name: string;
  description: string;
  totalDuration: number;
  status: 'active' | 'pending' | 'completed';
  assignedDate: string;
  scheduledDate?: string;
  exercises: WorkoutExercise[];
  exerciseCount: number;
}

interface ClientStats {
  totalWorkoutsCompleted: number;
  currentStreak: number;
  averageWorkoutTime: number;
  completionRate: number;
}

export default function ClientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<unknown>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<ClientStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loggingModalOpen, setLoggingModalOpen] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [activeTab, setActiveTab] = useState<'workouts' | 'progress' | 'history' | 'messages'>('workouts');
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.push('/signin');
      return;
    }

    setUser(currentUser);
    fetchUserWorkouts();
    fetchMessages();
  }, [router]);

  const fetchUserWorkouts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/workouts');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workouts');
      }

      const data = await response.json();
      setWorkouts(data.data.workouts);
      setStats(data.data.stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching workouts:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/messages');
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const handleStartWorkout = (workout: Workout) => {
    setSelectedWorkout(workout);
    setLoggingModalOpen(true);
  };

  const handleWorkoutComplete = () => {
    fetchUserWorkouts();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-900 text-green-200';
      case 'pending':
        return 'bg-yellow-900 text-yellow-200';
      case 'completed':
        return 'bg-blue-900 text-blue-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getNextWorkout = () => {
    if (!workouts || workouts.length === 0) return null;
    const active = workouts.find(w => w.status === 'active' || w.status === 'pending');
    return active;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-400">Loading your workouts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const nextWorkout = getNextWorkout();

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
              <span className="text-gray-300">Welcome, {typeof user === 'object' && (user as any)?.name}!</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm transition"
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

        {error && (
          <div className="mb-8 p-4 bg-red-900 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300">Active Workouts</h3>
            <p className="text-3xl font-bold mt-2">
              {workouts.filter(w => w.status === 'active').length}
            </p>
            <p className="text-gray-400 text-sm mt-1">Currently assigned</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300">Completion Rate</h3>
            <p className="text-3xl font-bold mt-2">{stats?.completionRate || 0}%</p>
            <p className="text-gray-400 text-sm mt-1">Overall progress</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300">Workouts Done</h3>
            <p className="text-3xl font-bold mt-2">{stats?.totalWorkoutsCompleted || 0}</p>
            <p className="text-gray-400 text-sm mt-1">Total completed</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-300">Avg. Duration</h3>
            <p className="text-3xl font-bold mt-2">{stats?.averageWorkoutTime || 0} min</p>
            <p className="text-gray-400 text-sm mt-1">Per workout</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Workouts/Progress/History */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
              <button
                onClick={() => setActiveTab('workouts')}
                className={`px-4 py-2 font-semibold border-b-2 transition ${activeTab === 'workouts'
                  ? 'border-indigo-600 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                Workouts
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`px-4 py-2 font-semibold border-b-2 transition ${activeTab === 'progress'
                  ? 'border-indigo-600 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                Progress
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 font-semibold border-b-2 transition ${activeTab === 'history'
                  ? 'border-indigo-600 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                History
              </button>
              <button
                onClick={() => setActiveTab('messages')}
                className={`px-4 py-2 font-semibold border-b-2 transition ${activeTab === 'messages'
                  ? 'border-indigo-600 text-indigo-400'
                  : 'border-transparent text-gray-400 hover:text-white'
                  }`}
              >
                Messages
              </button>
            </div>

            {/* Workouts Tab */}
            {activeTab === 'workouts' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Your Workouts</h2>
                </div>

                {workouts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-400">No workouts assigned yet. Contact your coach!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {workouts.slice(0, 5).map((workout) => (
                      <div key={workout.id} className="bg-gray-700 rounded p-4 hover:bg-gray-600 transition">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{workout.name}</h3>
                            <p className="text-sm text-gray-400 mt-1">
                              {workout.exerciseCount} exercises • {workout.totalDuration} minutes
                            </p>
                            <p className="text-xs text-gray-500 mt-2">{workout.description}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(workout.status)}`}>
                            {workout.status.charAt(0).toUpperCase() + workout.status.slice(1)}
                          </span>
                        </div>

                        {/* Exercises Preview */}
                        {workout.exercises.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-600">
                            <p className="text-xs text-gray-400 mb-2">Exercises:</p>
                            <div className="space-y-1">
                              {workout.exercises.slice(0, 3).map((exercise) => (
                                <div key={exercise.id} className="text-xs text-gray-300">
                                  • {exercise.exerciseName} - {exercise.sets}x{exercise.reps}
                                  {exercise.weight && ` @ ${exercise.weight}kg`}
                                </div>
                              ))}
                              {workout.exercises.length > 3 && (
                                <div className="text-xs text-gray-400">
                                  +{workout.exercises.length - 3} more exercises
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div className="mt-4 flex justify-between items-center">
                          <span className="text-sm text-gray-400">
                            Assigned: {formatDate(workout.assignedDate)}
                          </span>
                          <button
                            onClick={() => handleStartWorkout(workout)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm transition font-semibold"
                          >
                            Start Workout
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Progress Tab */}
            {activeTab === 'progress' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Your Progress</h2>
                <ProgressCharts />
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Messages</h2>
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <p className="text-gray-400">No messages yet.</p>
                  ) : messages.map((msg) => (
                    <div key={msg.id} className="bg-gray-700 rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-semibold text-indigo-300">{msg.sender_name}</span>
                        <span className="text-xs text-gray-400">{new Date(msg.created_at).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-200">{msg.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Workout History</h2>
                <WorkoutHistory expanded={true} />
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div>
            {/* Next Workout */}
            {nextWorkout && (
              <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-lg p-6 mb-6">
                <h3 className="font-semibold mb-4 text-indigo-100">Next Workout</h3>
                <div>
                  <p className="font-bold text-xl">{nextWorkout.name}</p>
                  <p className="text-sm text-indigo-200 mt-1">{nextWorkout.totalDuration} minutes</p>
                  <p className="text-indigo-100 text-xs mt-3">{nextWorkout.description}</p>
                  <button className="w-full mt-4 px-4 py-2 bg-white text-indigo-900 hover:bg-gray-100 rounded font-semibold transition">
                    Start Now
                  </button>
                </div>
              </div>
            )}

            {/* Coach Info */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Your Coach</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                  <span className="font-bold">C</span>
                </div>
                <div className="ml-4">
                  <p className="font-medium">Coach Name</p>
                  <p className="text-sm text-gray-400">Certified Personal Trainer</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('messages')}
                className="w-full mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition"
              >
                Message Coach
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <h3 className="font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Workouts Completed</p>
                  <p className="text-xl font-bold">{stats?.totalWorkoutsCompleted || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Current Streak</p>
                  <p className="text-xl font-bold">{stats?.currentStreak || 0} days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Avg. Workout Time</p>
                  <p className="text-xl font-bold">{stats?.averageWorkoutTime || 0} min</p>
                </div>
              </div>
            </div>

            {/* Upcoming Schedule */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Upcoming Workouts</h3>
              {workouts.length === 0 ? (
                <p className="text-gray-400 text-sm">No upcoming workouts</p>
              ) : (
                <div className="space-y-3">
                  {workouts.slice(0, 3).map((workout) => (
                    <div key={workout.id} className="flex justify-between items-center pb-3 border-b border-gray-700 last:border-b-0">
                      <div>
                        <p className="font-medium text-sm">{workout.name}</p>
                        <p className="text-xs text-gray-400">{formatDate(workout.assignedDate)}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs ${getStatusColor(workout.status)}`}>
                        {workout.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Workout Logging Modal */}
      <WorkoutLoggingModal
        isOpen={loggingModalOpen}
        workout={selectedWorkout}
        onClose={() => {
          setLoggingModalOpen(false);
          setSelectedWorkout(null);
        }}
        onComplete={handleWorkoutComplete}
      />
    </div>
  );
}