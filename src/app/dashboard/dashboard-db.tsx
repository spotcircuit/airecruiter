'use client';

import { useEffect, useState } from 'react';
import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { MorningBrief } from '@/components/morning-brief';

interface DashboardStats {
  companies: number;
  deals: number;
  jobs: number;
  candidates: number;
  submissions: number;
  activeDeals: number;
  wonDeals: number;
  totalDealValue: number;
}

export function DashboardDB() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [companiesRes, dealsRes, jobsRes, candidatesRes] = await Promise.all([
        fetch('/api/companies'),
        fetch('/api/deals'),
        fetch('/api/jobs').catch(() => ({ json: async () => ({ jobs: [] }) })),
        fetch('/api/candidates').catch(() => ({ json: async () => ({ candidates: [] }) }))
      ]);

      const companiesData = await companiesRes.json();
      const dealsData = await dealsRes.json();
      const jobsData = await jobsRes.json();
      const candidatesData = await candidatesRes.json();

      const companies = companiesData.companies || [];
      const dealsFromApi = dealsData.deals || [];
      const jobs = jobsData.jobs || [];
      const candidates = candidatesData.candidates || [];
      
      setDeals(dealsFromApi); // Store deals for pipeline summary

      // Calculate stats
      const activeDeals = dealsFromApi.filter((d: any) => !['won', 'lost'].includes(d.stage)).length;
      const wonDeals = dealsFromApi.filter((d: any) => d.stage === 'won').length;
      const totalDealValue = dealsFromApi
        .filter((d: any) => d.stage === 'won')
        .reduce((sum: number, d: any) => sum + (parseFloat(d.value) || 0), 0);

      setStats({
        companies: companies.length,
        deals: dealsFromApi.length,
        jobs: jobs.length,
        candidates: candidates.length,
        submissions: 0, // Will implement when we have submissions API
        activeDeals,
        wonDeals,
        totalDealValue
      });
      
      setError(null);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
        <p className="text-red-700">{error}</p>
        <button 
          onClick={fetchStats}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    { 
      name: 'Companies', 
      value: stats.companies.toString(), 
      icon: BuildingOfficeIcon, 
      change: '+5', 
      changeType: 'increase' as const,
      gradient: 'from-blue-500 to-cyan-400',
      description: 'Partner companies in database'
    },
    { 
      name: 'Active Deals', 
      value: stats.activeDeals.toString(), 
      icon: BriefcaseIcon, 
      change: `${stats.deals} total`, 
      changeType: 'neutral' as const,
      gradient: 'from-violet-500 to-purple-500',
      description: 'Deals in pipeline (excluding won/lost)'
    },
    { 
      name: 'Candidates', 
      value: stats.candidates.toString(), 
      icon: UserGroupIcon, 
      change: '+30', 
      changeType: 'increase' as const,
      gradient: 'from-green-400 to-emerald-500',
      description: 'Total candidate profiles'
    },
    { 
      name: 'Won Deals Value', 
      value: `$${(stats.totalDealValue / 1000).toFixed(0)}k`, 
      icon: ChartBarIcon, 
      change: `${stats.wonDeals} won`, 
      changeType: 'increase' as const,
      gradient: 'from-amber-400 to-orange-500',
      description: 'Total value of won deals'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard (Live Data)</h1>
        <button
          onClick={fetchStats}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((item) => (
          <div key={item.name} className="overflow-hidden rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className={`h-2 bg-gradient-to-r ${item.gradient}`} />
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                    <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-500">{item.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-gray-600">{item.description}</p>
                <div className="mt-2 flex items-center text-sm">
                  {item.changeType === 'increase' && (
                    <>
                      <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 font-medium">{item.change}</span>
                      <span className="text-gray-500 ml-1">this week</span>
                    </>
                  )}
                  {item.changeType === ('decrease' as any) && (
                    <>
                      <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-red-600 font-medium">{item.change}</span>
                      <span className="text-gray-500 ml-1">this week</span>
                    </>
                  )}
                  {item.changeType === 'neutral' && (
                    <span className="text-gray-600">{item.change}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Morning Brief */}
      <div className="mb-6">
        <MorningBrief />
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">BD Pipeline Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Prospect</span>
              <span className="font-medium">{deals.filter((d: any) => d.stage === 'prospect').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Discovery</span>
              <span className="font-medium">{deals.filter((d: any) => d.stage === 'discovery').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Proposal</span>
              <span className="font-medium">{deals.filter((d: any) => d.stage === 'proposal').length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Won</span>
              <span className="font-medium text-green-600">{stats.wonDeals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Lost</span>
              <span className="font-medium text-red-600">{deals.filter((d: any) => d.stage === 'lost').length}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Database Overview</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Companies</span>
              <span className="font-medium">{stats.companies}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Deals</span>
              <span className="font-medium">{stats.deals}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Jobs</span>
              <span className="font-medium">{stats.jobs}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Candidates</span>
              <span className="font-medium">{stats.candidates}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Active Submissions</span>
              <span className="font-medium">{stats.submissions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}