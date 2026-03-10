"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth-client';
import WorkoutLoggingModal from '@/components/WorkoutLoggingModal';
import ProgressCharts from '@/components/ProgressCharts';
import WorkoutHistory from '@/components/WorkoutHistory';
import { Send, MessageSquare, Flame, Timer, CheckCircle2, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
  daysUntil?: number;
}

interface ClientStats {
  totalWorkoutsCompleted: number;
  currentStreak: number;
  averageWorkoutTime: number;
  completionRate: number;
  coach?: {
    name: string;
    email: string;
    userId?: string;
  };
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
  const [messages, setMessages] = useState<{ id: string; sender_id: string; sender_name: string; content: string; created_at: string; }[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();

    if (!currentUser) {
      router.push('/auth/signin');
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
      console.log('Fetched workouts:', data);
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if we have a coach
    if (!stats || !stats.coach || !stats.coach.userId) {
      alert('You need to be assigned to a coach before sending messages.');
      return;
    }
    
    if (!newMessage.trim() || sendingMessage) return;

    try {
      setSendingMessage(true);
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: stats.coach.userId,
          content: newMessage.trim(),
        }),
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        console.error('Message send error:', responseData);
        alert(`Failed to send message: ${responseData.error || 'Unknown error'}`);
        return;
      }

      if (responseData.success) {
        setNewMessage('');
        fetchMessages();
      } else {
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Error sending message. Please try again.');
    } finally {
      setSendingMessage(false);
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
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getRelativeDateString = (daysUntil?: number, dateString?: string) => {
    if (daysUntil === undefined || daysUntil === null) return formatDate(dateString || "");
    if (daysUntil === 0) return 'Today';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil === -1) return 'Yesterday';
    if (daysUntil > 1 && daysUntil <= 7) return `In ${daysUntil} days`;
    if (daysUntil < -1 && daysUntil >= -7) return `${Math.abs(daysUntil)} days ago`;
    return formatDate(dateString || "");
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
              <span className="text-gray-300">Welcome, {typeof user === 'object' && (user as { name?: string })?.name}!</span>
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
            <AnimatePresence mode="wait">
              {activeTab === 'workouts' && (
                <motion.div
                  key="workouts"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] p-8 shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-8">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter">Combat Protocols</h2>
                      <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">Assigned Mission Flow</p>
                    </div>
                  </div>

                  {workouts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-900/40 rounded-[2rem] border border-dashed border-gray-800">
                      <p className="text-gray-500 font-medium">No active protocols detected. Contact command.</p>
                    </div>
                  ) : (
                    <div className="grid gap-6">
                      {workouts.map((workout) => (
                        <motion.div
                          layout
                          key={workout.id}
                          className="bg-gray-900/60 border border-gray-800 rounded-[1.5rem] p-6 hover:border-indigo-500/50 transition-all group relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-all"></div>
                          <div className="flex justify-between items-start relative z-10">
                            <div className="flex-1">
                              <h3 className="font-black text-xl text-white tracking-tight">{workout.name}</h3>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                  <Timer size={14} /> {workout.totalDuration}m
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-gray-400 font-bold uppercase tracking-widest">
                                  <Flame size={14} /> {workout.exerciseCount} segments
                                </span>
                              </div>
                            </div>
                            <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${workout.status === 'active' ? 'bg-indigo-600/10 text-indigo-400 border-indigo-500/30' : 'bg-gray-800 text-gray-500 border-gray-700'
                              }`}>
                              {workout.status}
                            </span>
                          </div>

                          <div className="mt-8 flex justify-between items-center relative z-10">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                              Schedule: {getRelativeDateString(workout.daysUntil, workout.assignedDate)}
                            </span>
                            <button
                              onClick={() => handleStartWorkout(workout)}
                              className="px-6 py-3 bg-white text-gray-950 hover:bg-indigo-500 hover:text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-black/20"
                            >
                              Initiate
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Progress Tab */}
              {activeTab === 'progress' && (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-[2.5rem] p-8"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tighter">Evolution Signatures</h2>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">Biometric & Output Analysis</p>
                  </div>
                  <ProgressCharts />
                </motion.div>
              )}

              {/* History Tab */}
              {activeTab === 'history' && (
                <motion.div
                  key="history"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-[2.5rem] p-8"
                >
                  <div className="mb-8">
                    <h2 className="text-3xl font-black text-white tracking-tighter">Legacy Logs</h2>
                    <p className="text-gray-500 text-xs font-black uppercase tracking-widest mt-1">Verified Performance History</p>
                  </div>
                  <WorkoutHistory expanded={true} />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages Tab */}
            {activeTab === 'messages' && (
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] overflow-hidden flex flex-col h-[600px]">
                <div className="p-6 border-b border-gray-700/50 bg-gray-800/30 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Direct Channels</h2>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Status: Operational</p>
                  </div>
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-600 border-2 border-gray-800 flex items-center justify-center text-[10px] font-bold">C</div>
                    <div className="w-8 h-8 rounded-full bg-gray-700 border-2 border-gray-800 flex items-center justify-center text-[10px] font-bold">U</div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-gray-900/20">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                      <div className="p-4 bg-gray-800 rounded-2xl border border-gray-700">
                        <MessageSquare className="text-gray-600" size={32} />
                      </div>
                      <p className="text-gray-500 text-sm font-medium">No encrypted traffic detected.<br />Initiate movement discussion.</p>
                    </div>
                  ) : [...messages].reverse().map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender_id === (user as { userId?: string })?.userId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender_id === (user as { userId?: string })?.userId
                        ? 'bg-indigo-600 text-white rounded-br-sm'
                        : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-bl-sm'
                        }`}>
                        <div className="flex justify-between items-baseline gap-4 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">
                            {msg.sender_id === (user as { userId?: string })?.userId ? 'Me' : msg.sender_name}
                          </span>
                          <span className="text-[10px] opacity-40">{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendMessage} className="p-6 bg-gray-800/30 border-t border-gray-700/50">
                  <div className="relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Transmit message..."
                      className="w-full bg-gray-950/50 border border-gray-700 rounded-2xl py-4 px-6 text-sm font-medium outline-none focus:border-indigo-500 transition-all pr-16"
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sendingMessage}
                      className="absolute right-2 top-2 bottom-2 w-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all active:scale-95 disabled:opacity-50"
                    >
                      <Send size={18} />
                    </button>
                  </div>
                </form>
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
                  <p className="text-sm text-indigo-200 mt-1">
                    {getRelativeDateString(nextWorkout.daysUntil, nextWorkout.assignedDate)} • {nextWorkout.totalDuration} minutes
                  </p>
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
                  <span className="font-bold">{stats?.coach?.name?.charAt(0) || 'C'}</span>
                </div>
                <div className="ml-4">
                  <p className="font-medium">{stats?.coach?.name || 'Assigned Coach'}</p>
                  <p className="text-sm text-gray-400">{stats?.coach?.email || 'Certified Personal Trainer'}</p>
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
            <div className="bg-gray-800/40 backdrop-blur-xl border border-gray-700/50 rounded-[2rem] p-8 shadow-xl">
              <h3 className="text-xs font-black text-gray-500 uppercase tracking-[0.2em] mb-6">Vital Metrics</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-600/10 rounded-xl">
                      <CheckCircle2 className="text-indigo-400" size={18} />
                    </div>
                    <span className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total Flow</span>
                  </div>
                  <span className="text-xl font-black text-white">{stats?.totalWorkoutsCompleted || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-600/10 rounded-xl">
                      <Flame className="text-orange-400" size={18} />
                    </div>
                    <span className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">Stonework Streak</span>
                  </div>
                  <span className="text-xl font-black text-white">{stats?.currentStreak || 0}d</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-600/10 rounded-xl">
                      <Clock className="text-blue-400" size={18} />
                    </div>
                    <span className="text-sm text-gray-400 font-bold uppercase tracking-widest text-[10px]">Avg Duration</span>
                  </div>
                  <span className="text-xl font-black text-white">{stats?.averageWorkoutTime || 0}m</span>
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
                        <p className="text-xs text-gray-400">{getRelativeDateString(workout.daysUntil, workout.assignedDate)}</p>
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