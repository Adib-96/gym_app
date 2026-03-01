"use client";
import { useEffect, useState } from 'react';
// Recharts components
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface ProgressMetric {
  date: string;
  weightLifted?: number;
  reps: number;
  sets: number;
  totalVolume?: number;
  exerciseName?: string;
  exerciseId?: string;
}

interface LoggedExercise {
  id: string;
  name: string;
  muscleGroup: string;
}

interface ProgressChartsProps {
  clientId?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: { payload: ProgressMetric }[];
  label?: string;
  selectedMetric: 'weight' | 'volume';
  maxWeight: number;
  maxVolume: number;
}

// Specialized Custom Tooltip for premium feel
const CustomTooltip = ({ active, payload, selectedMetric, maxWeight, maxVolume }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPR = selectedMetric === 'weight'
      ? Number(data.weightLifted) === maxWeight
      : Number(data.totalVolume) === maxVolume;

    return (
      <div className="bg-gray-950/95 backdrop-blur-xl border border-gray-800 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] min-w-[200px] border-l-4 border-l-indigo-500">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">
              {new Date(data.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
            </p>
            <p className="text-xs font-bold text-white mt-0.5">{data.exerciseName}</p>
          </div>
          {isPR && (
            <span className="bg-amber-400/10 text-amber-400 text-[8px] font-black px-2 py-0.5 rounded-full border border-amber-400/20 animate-pulse">PR</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-800 pt-3 mt-2">
          <div>
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Performance</p>
            <p className="text-sm font-black text-indigo-400">
              {Number(selectedMetric === 'weight' ? data.weightLifted : data.totalVolume).toFixed(1)}
              <span className="text-[10px] opacity-70 ml-1">kg</span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">Protocol</p>
            <p className="text-sm font-black text-gray-300">{data.sets} <span className="text-[10px] opacity-50">x</span> {data.reps}</p>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function ProgressCharts({ clientId }: ProgressChartsProps) {
  const [progressData, setProgressData] = useState<ProgressMetric[]>([]);
  const [availableExercises, setAvailableExercises] = useState<LoggedExercise[]>([]);
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>('all');
  const [streakStats, setStreakStats] = useState<{ currentStreak: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<'weight' | 'volume'>('volume');
  const [timeframe, setTimeframe] = useState<number>(30);

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    fetchProgressData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeframe, selectedExerciseId, clientId]);

  const fetchExercises = async () => {
    try {
      const response = await fetch('/api/workouts/progress/exercises');
      if (response.ok) {
        const data = await response.json();
        setAvailableExercises(data.data);
      }
    } catch (error) {
      console.error('Error fetching available exercises:', error);
    }
  };

  const fetchProgressData = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/workouts/progress?clientId=${clientId || ''}&timeframe=${timeframe}&exerciseId=${selectedExerciseId}`);
      if (response.ok) {
        const data = await response.json();
        // Ensure data is sorted by date for Recharts
        const progressArray = data.data?.progressData || [];
        const sortedData = [...progressArray].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setProgressData(sortedData);
        setStreakStats(data.data?.streakStats || null);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-900/50 rounded-3xl border border-gray-800 backdrop-blur-sm">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 bg-indigo-500/10 blur-xl animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  const maxWeight = Math.max(...progressData.map(d => d.weightLifted || 0), 0);
  const maxVolume = Math.max(...progressData.map(d => d.totalVolume || 0), 0);
  const minVal = Math.min(...progressData.map(d => selectedMetric === 'weight' ? Number(d.weightLifted || 0) : Number(d.totalVolume || 0)), 0);

  // Prepare chart data with formatted date for labels
  const chartData = progressData.map(d => ({
    ...d,
    formattedDate: new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    displayValue: selectedMetric === 'weight' ? d.weightLifted : d.totalVolume
  }));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gray-900/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-colors duration-700"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <span className="text-white text-xs font-black">P</span>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">Evolution Flow</h2>
          </div>
          <p className="text-gray-400 text-sm font-medium ml-1">Visualize your strength and volume progression</p>
        </div>

        <div className="flex flex-wrap gap-3 relative z-10 w-full md:w-auto">
          <select
            value={selectedExerciseId}
            onChange={(e) => setSelectedExerciseId(e.target.value)}
            className="flex-1 md:flex-none min-w-[180px] bg-gray-950/80 text-white font-bold text-xs py-3.5 px-6 rounded-2xl border border-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none transition-all hover:bg-gray-900 shadow-xl"
          >
            <option value="all">All Movements</option>
            {availableExercises.map((ex) => (
              <option key={ex.id} value={ex.id}>{ex.name}</option>
            ))}
          </select>

          <div className="flex-1 md:flex-none inline-flex bg-gray-950/80 p-1 rounded-2xl border border-gray-800 shadow-xl">
            {[7, 30, 90].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === t
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20 scale-105'
                  : 'text-gray-500 hover:text-gray-300'
                  }`}
              >
                {t}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2rem] relative overflow-hidden group hover:border-green-500/30 transition-all duration-500 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 blur-[50px] -mr-10 -mt-10 group-hover:bg-green-500/10 transition-colors"></div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Intensity Streak</span>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-black text-white tracking-tighter">{streakStats?.currentStreak || 0}</p>
            <span className="text-xs font-bold text-green-400">Days</span>
          </div>
          <p className="text-[10px] text-gray-600 font-bold mt-4 uppercase tracking-widest">Consistency Factor</p>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2rem] relative overflow-hidden group hover:border-indigo-500/30 transition-all duration-500 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] -mr-10 -mt-10 group-hover:bg-indigo-500/10 transition-colors"></div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Personal Bests</span>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-black text-indigo-400 tracking-tighter">{progressData.length > 0 ? progressData.filter(d => d.weightLifted === maxWeight).length : 0}</p>
            <span className="text-xs font-bold text-gray-400">Records</span>
          </div>
          <p className="text-[10px] text-gray-600 font-bold mt-4 uppercase tracking-widest">Performance Peak</p>
        </div>

        <div className="bg-gray-900/40 border border-gray-800 p-8 rounded-[2rem] relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500 shadow-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-[50px] -mr-10 -mt-10 group-hover:bg-amber-500/10 transition-colors"></div>
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Peak Load</span>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-4xl font-black text-amber-500 tracking-tighter">{maxWeight.toFixed(1)}</p>
            <span className="text-xs font-bold text-gray-400">KG</span>
          </div>
          <p className="text-[10px] text-gray-600 font-bold mt-4 uppercase tracking-widest text-right">Max Force Output</p>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-10 shadow-[0_30px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group/chart">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none group-hover/chart:bg-indigo-500/10 transition-colors duration-1000"></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-16 relative z-10">
          <div className="inline-flex bg-gray-950 p-2 rounded-2xl border border-gray-800">
            <button
              onClick={() => setSelectedMetric('weight')}
              className={`px-8 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all ${selectedMetric === 'weight'
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 scale-105'
                : 'text-gray-500 hover:text-gray-400'
                }`}
            >
              PR WEIGHT
            </button>
            <button
              onClick={() => setSelectedMetric('volume')}
              className={`px-8 py-3 text-[10px] font-black tracking-widest rounded-xl transition-all ${selectedMetric === 'volume'
                ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 scale-105'
                : 'text-gray-500 hover:text-gray-400'
                }`}
            >
              TOTAL VOLUME
            </button>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{selectedMetric === 'weight' ? 'Max Intensity' : 'Peak Volume'}</span>
              <span className="text-lg font-black text-indigo-400">{(selectedMetric === 'weight' ? maxWeight : maxVolume).toFixed(1)} kg</span>
            </div>
            <div className="w-px h-10 bg-gray-800 hidden sm:block"></div>
            <div className="text-[10px] text-gray-600 font-black uppercase tracking-widest bg-gray-950 px-5 py-2 rounded-full border border-gray-800">
              {progressData.length} Logs Analyzed
            </div>
          </div>
        </div>

        {progressData.length > 1 ? (
          <div className="h-[450px] w-full relative group/svg overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                    <stop offset="40%" stopColor="#6366f1" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <filter id="recharts-glow">
                    <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid
                  vertical={false}
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  opacity={0.3}
                />

                <XAxis
                  dataKey="formattedDate"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }}
                  dy={15}
                  padding={{ left: 20, right: 20 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 900 }}
                  dx={-10}
                  domain={[minVal * 0.9, 'auto']}
                />

                <Tooltip
                  content={<CustomTooltip selectedMetric={selectedMetric} maxWeight={maxWeight} maxVolume={maxVolume} />}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '5 5' }}
                />

                <Area
                  type="monotone"
                  dataKey="displayValue"
                  stroke="#6366f1"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#chartGradient)"
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  activeDot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isPR = selectedMetric === 'weight'
                      ? Number(payload.weightLifted) === maxWeight
                      : Number(payload.totalVolume) === maxVolume;

                    return (
                      <g>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={6}
                          className={isPR ? 'fill-amber-400' : 'fill-white'}
                          stroke="#030712"
                          strokeWidth={2}
                        />
                        {isPR && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={12}
                            className="fill-amber-400/20 animate-ping"
                          />
                        )}
                      </g>
                    );
                  }}
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  dot={(props: any) => {
                    const { cx, cy, payload } = props;
                    const isPR = selectedMetric === 'weight'
                      ? Number(payload.weightLifted) === maxWeight
                      : Number(payload.totalVolume) === maxVolume;

                    if (isPR) {
                      return (
                        <circle cx={cx} cy={cy} r={4} className="fill-amber-400 shadow-xl" />
                      );
                    }
                    return <g />; // Don't show regular dots, only PRs and active dots
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : progressData.length === 1 ? (
          <div className="h-[450px] flex flex-col items-center justify-center bg-gray-950/20 rounded-[2.5rem] border border-gray-800/50">
            <div className="relative mb-8">
              <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center rotate-12">
                <div className="w-4 h-4 rounded-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]"></div>
              </div>
              <div className="absolute inset-0 bg-indigo-500/5 animate-pulse rounded-full blur-3xl"></div>
            </div>
            <p className="text-white font-black text-2xl tracking-tight">Data Integrity Phase</p>
            <p className="text-gray-500 text-base mt-2 max-w-xs text-center font-medium leading-relaxed">
              One session detected. We require a second milestone to perform cadence analysis.
            </p>
            <div className="mt-10 px-8 py-4 bg-indigo-600/10 rounded-[1.5rem] border border-indigo-500/20 flex items-center gap-4">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Base Marker:</span>
              <span className="text-white font-black text-lg">{Number(selectedMetric === 'weight' ? progressData[0].weightLifted : progressData[0].totalVolume).toFixed(1)} KG</span>
            </div>
          </div>
        ) : (
          <div className="h-[450px] flex flex-col items-center justify-center bg-gray-950/20 rounded-[2.5rem] border border-dashed border-gray-800">
            <div className="p-6 bg-gray-800/50 rounded-full mb-6">
              <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <p className="text-white font-black text-xl tracking-tight">No progression signatures found</p>
            <p className="text-gray-500 text-base mt-2 max-w-sm text-center font-medium">
              {selectedExerciseId === 'all'
                ? "Initiate your first session to begin tracking your evolution flow."
                : "No telemetry records found for this movement in the selected window."}
            </p>
          </div>
        )}
      </div>

      {/* Detail Grid */}
      {progressData.length > 0 && (
        <div className="bg-gray-900 shadow-2xl border border-gray-800 rounded-[2.5rem] p-10">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-2xl font-black text-white tracking-tight">Log Breakdown</h3>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-5 py-2 rounded-full uppercase tracking-[0.2em] font-black">History</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {progressData.slice(-6).reverse().map((metric, idx) => (
              <div key={idx} className="bg-gray-950 p-6 rounded-3xl border border-gray-800 hover:border-indigo-500/50 transition-all group/card shadow-lg hover:shadow-indigo-500/10">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest bg-gray-900 px-3 py-1.5 rounded-xl">
                    {new Date(metric.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="h-2.5 w-2.5 rounded-full bg-indigo-500/20 border border-indigo-500/50 group-hover/card:bg-indigo-500 transition-colors"></div>
                </div>
                <p className="text-base font-black text-white line-clamp-1 mb-8 group-hover/card:text-indigo-400 transition-colors">{metric.exerciseName}</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-gray-700 font-black uppercase mb-2">Total Volume</span>
                    <span className="text-xl font-black text-gray-300 tabular-nums">{Number(metric.totalVolume || 0).toFixed(0)}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[9px] text-gray-700 font-black uppercase mb-2">PR Marker</span>
                    <span className="text-xl font-black text-green-400 tabular-nums">{Number(metric.weightLifted || 0).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
