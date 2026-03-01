"use client";
import React, { useEffect, useState } from 'react';
import {
  Users,
  Dumbbell,
  TrendingUp,
  UserCheck,
  ArrowUpRight,
  ArrowDownRight,
  Loader2
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalCoaches: number;
  totalClients: number;
  totalWorkouts: number;
  revenue: number;
  activeSubscriptions: number;
}

const AdminPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.stats);
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500 w-10 h-10" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Active Coaches',
      value: stats?.totalCoaches || 0,
      icon: UserCheck,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
      change: '+18%',
      trend: 'up'
    },
    {
      title: 'Workouts Logged',
      value: stats?.totalWorkouts || 0,
      icon: Dumbbell,
      color: 'text-orange-400',
      bg: 'bg-orange-400/10',
      change: '+24%',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-purple-500/30 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className={`${card.bg} p-3 rounded-xl`}>
                  <Icon className={`${card.color} w-6 h-6`} />
                </div>
                <div className={`flex items-center text-xs font-medium ${card.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {card.change}
                  {card.trend === 'up' ? <ArrowUpRight className="ml-1 w-3 h-3" /> : <ArrowDownRight className="ml-1 w-3 h-3" />}
                </div>
              </div>
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              <h2 className="text-3xl font-bold mt-1 group-hover:scale-105 transition-transform origin-left duration-300">
                {card.value.toLocaleString()}
              </h2>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <TrendingUp className="mr-2 text-purple-500" />
              Growth Overview
            </h3>
            <select className="bg-gray-800 border-gray-700 rounded-lg text-sm px-3 py-1 outline-none focus:ring-1 focus:ring-purple-500">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500 border border-dashed border-gray-800 rounded-xl">
            Chart Placeholder (Integrate Recharts here if available)
          </div>
        </div>

        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center flex-shrink-0 text-xs font-bold ring-1 ring-gray-700">
                  U{i}
                </div>
                <div>
                  <p className="text-sm font-medium">New coach registered</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-xl text-sm font-medium transition-colors">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;