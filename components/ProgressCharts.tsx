"use client";
import { useEffect, useState } from 'react';

interface ProgressMetric {
  date: string;
  weightLifted?: number;
  reps: number;
  sets: number;
  totalVolume?: number;
}

interface ProgressChartsProps {
  clientId?: string;
}

export default function ProgressCharts({ clientId }: ProgressChartsProps) {
  const [progressData, setProgressData] = useState<ProgressMetric[]>([]);
  const [streakStats, setStreakStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'volume'>('volume');

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/workouts/progress?days=90');
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch progress data');
      }
      
      const data = await response.json();
      setProgressData(data.data.progressData);
      setStreakStats(data.data.streakStats);
    } catch (error) {
      console.error('Error fetching progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Loading progress data...</p>
      </div>
    );
  }

  const maxWeight = Math.max(...(progressData.map(d => d.weightLifted) || []), 1);
  const maxVolume = Math.max(...(progressData.map(d => d.totalVolume) || []), 1);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-900 p-4 rounded-lg">
          <p className="text-green-200 text-sm">Personal Record Weight</p>
          <p className="text-2xl font-bold text-white mt-2">
            {maxWeight.toFixed(1)} kg
          </p>
        </div>
        <div className="bg-blue-900 p-4 rounded-lg">
          <p className="text-blue-200 text-sm">Total Volume</p>
          <p className="text-2xl font-bold text-white mt-2">
            {maxVolume.toFixed(0)} kg
          </p>
        </div>
        <div className="bg-purple-900 p-4 rounded-lg">
          <p className="text-purple-200 text-sm">Last Workout</p>
          <p className="text-2xl font-bold text-white mt-2">
            {streakStats?.lastWorkout
              ? new Date(streakStats.lastWorkout).toLocaleDateString()
              : 'N/A'}
          </p>
        </div>
      </div>

      {/* Chart Toggle */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setSelectedMetric('weight')}
          className={`px-4 py-2 rounded ${
            selectedMetric === 'weight'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Weight Progression
        </button>
        <button
          onClick={() => setSelectedMetric('volume')}
          className={`px-4 py-2 rounded ${
            selectedMetric === 'volume'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Total Volume
        </button>
      </div>

      {/* Chart */}
      {progressData.length > 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 h-96">
          <div className="flex h-full items-end gap-1">
            {progressData.map((metric, idx) => {
              const value = selectedMetric === 'weight' ? metric.weightLifted : metric.totalVolume;
              const maxValue = selectedMetric === 'weight' ? maxWeight : maxVolume;
              const height = ((value || 0) / maxValue) * 100;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all hover:from-blue-500 hover:to-blue-300 cursor-pointer"
                    style={{ height: `${Math.max(height, 5)}%` }}
                    title={`${value?.toFixed(1)} - ${new Date(metric.date).toLocaleDateString()}`}
                  />
                  <span className="text-xs text-gray-500 mt-2 hidden group-hover:block">
                    {new Date(metric.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Y-axis labels */}
          <div className="relative mt-4 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>0</span>
              <span>{(selectedMetric === 'weight' ? maxWeight : maxVolume).toFixed(0)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <p className="text-gray-400">No progress data yet. Complete some workouts to see your progress!</p>
        </div>
      )}

      {/* Data Table */}
      {progressData.length > 0 && (
        <div className="bg-gray-800 rounded-lg p-6 overflow-x-auto">
          <h3 className="font-semibold mb-4 text-white">Recent Progress</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left px-4 py-2 text-gray-300">Date</th>
                <th className="text-left px-4 py-2 text-gray-300">Weight</th>
                <th className="text-left px-4 py-2 text-gray-300">Sets</th>
                <th className="text-left px-4 py-2 text-gray-300">Reps</th>
                <th className="text-left px-4 py-2 text-gray-300">Total Volume</th>
              </tr>
            </thead>
            <tbody>
              {progressData.slice(0, 10).map((metric, idx) => (
                <tr key={idx} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2">
                    {new Date(metric.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">{metric.weightLifted?.toFixed(1) || '-'} kg</td>
                  <td className="px-4 py-2">{metric.sets}</td>
                  <td className="px-4 py-2">{metric.reps}</td>
                  <td className="px-4 py-2">{metric.totalVolume?.toFixed(0) || '-'} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
