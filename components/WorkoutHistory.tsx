"use client";
import { useEffect, useState } from 'react';

interface WorkoutSession {
  id: string;
  workoutName: string;
  startedAt: string;
  completedAt?: string;
  durationMinutes?: number;
  status: string;
  exercisesLogged: number;
  notes?: string;
}

interface WorkoutHistoryProps {
  expanded?: boolean;
}

export default function WorkoutHistory({ expanded = false }: WorkoutHistoryProps) {
  const [history, setHistory] = useState<WorkoutSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkoutHistory();
  }, []);

  const fetchWorkoutHistory = async () => {
    try {
      setLoading(true);
      const limit = expanded ? 50 : 10;
      const response = await fetch(`/api/workouts/history?limit=${limit}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch workout history');
      }
      
      const data = await response.json();
      setHistory(data.data);
    } catch (error) {
      console.error('Error fetching workout history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-900 text-green-200';
      case 'in_progress':
        return 'bg-yellow-900 text-yellow-200';
      case 'abandoned':
        return 'bg-red-900 text-red-200';
      default:
        return 'bg-gray-900 text-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading workout history...</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-12 text-center">
        <p className="text-gray-400">No workout history yet. Start a workout to begin tracking!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((session) => (
        <div key={session.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition cursor-pointer"
          onClick={() => setSelectedSession(selectedSession === session.id ? null : session.id)}
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-white">{session.workoutName}</h3>
              <p className="text-sm text-gray-400 mt-1">
                {formatDate(session.startedAt)}
              </p>
              {session.notes && (
                <p className="text-sm text-gray-400 mt-2">{session.notes}</p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-xs text-gray-400">Duration</p>
                <p className="text-lg font-bold text-white">
                  {session.durationMinutes ? `${session.durationMinutes} min` : '-'}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                {session.status === 'in_progress' ? 'In Progress' : 
                 session.status === 'completed' ? 'Completed' : 
                 'Abandoned'}
              </span>
            </div>
          </div>

          {/* Exercises Logged */}
          <div className="mt-3 pt-3 border-t border-gray-700">
            <p className="text-xs text-gray-400">
              {session.exercisesLogged} exercise{session.exercisesLogged !== 1 ? 's' : ''} logged
            </p>
          </div>

          {/* Expandable Details */}
          {selectedSession === session.id && (
            <div className="mt-4 pt-4 border-t border-gray-600">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Started</p>
                  <p className="text-sm text-white mt-1">
                    {new Date(session.startedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Completed</p>
                  <p className="text-sm text-white mt-1">
                    {session.completedAt 
                      ? new Date(session.completedAt).toLocaleTimeString()
                      : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Volume</p>
                  <p className="text-sm text-white mt-1">-</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
