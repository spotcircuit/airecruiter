'use client';

import { useState } from 'react';
import { 
  ChartBarIcon, 
  UserGroupIcon, 
  BriefcaseIcon, 
  ClockIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { AnalyticsData, HiringTrend } from '@/types';

// Mock analytics data
const mockAnalyticsData: AnalyticsData = {
  total_jobs: 24,
  total_candidates: 156,
  total_applications: 342,
  time_to_fill: 28, // days
  conversion_rate: 4.2, // percentage
  diversity_metrics: {
    gender: {
      'Male': 58,
      'Female': 39,
      'Non-binary': 2,
      'Prefer not to say': 1
    },
    ethnicity: {
      'White': 42,
      'Asian': 28,
      'Hispanic': 15,
      'Black': 10,
      'Other': 5
    },
    age_groups: {
      '18-24': 15,
      '25-34': 45,
      '35-44': 25,
      '45-54': 10,
      '55+': 5
    }
  },
  hiring_trends: [
    { month: 'Jan', applications: 42, interviews: 18, hires: 3 },
    { month: 'Feb', applications: 38, interviews: 15, hires: 2 },
    { month: 'Mar', applications: 56, interviews: 24, hires: 4 },
    { month: 'Apr', applications: 64, interviews: 28, hires: 5 },
    { month: 'May', applications: 48, interviews: 20, hires: 3 },
    { month: 'Jun', applications: 52, interviews: 22, hires: 4 }
  ]
};

export default function AnalyticsPage() {
  const [analyticsData] = useState<AnalyticsData>(mockAnalyticsData);
  const [timeRange] = useState<'last_30_days' | 'last_90_days' | 'last_year'>('last_30_days');

  // Helper function to calculate percentage change
  const calculateChange = (current: number, previous: number): { value: number; isPositive: boolean } => {
    const change = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Math.round(change * 10) / 10),
      isPositive: change >= 0
    };
  };

  // Mock previous period data for comparison
  const previousPeriodData = {
    total_jobs: 18,
    total_candidates: 120,
    total_applications: 280,
    time_to_fill: 32,
    conversion_rate: 3.8
  };

  // Calculate changes
  const jobsChange = calculateChange(analyticsData.total_jobs, previousPeriodData.total_jobs);
  const candidatesChange = calculateChange(analyticsData.total_candidates, previousPeriodData.total_candidates);
  const applicationsChange = calculateChange(analyticsData.total_applications, previousPeriodData.total_applications);
  const timeToFillChange = calculateChange(previousPeriodData.time_to_fill, analyticsData.time_to_fill); // Inverted because lower is better

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Track your recruiting metrics and performance
        </p>
      </div>

      {/* Time range selector */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-sm font-medium ${
              timeRange === 'last_30_days'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Last 30 Days
          </button>
          <button
            type="button"
            className={`relative -ml-px inline-flex items-center px-3 py-2 text-sm font-medium ${
              timeRange === 'last_90_days'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Last 90 Days
          </button>
          <button
            type="button"
            className={`relative -ml-px inline-flex items-center rounded-r-md px-3 py-2 text-sm font-medium ${
              timeRange === 'last_year'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Last Year
          </button>
        </div>
      </div>

      {/* Key metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Jobs */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BriefcaseIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Jobs</dt>
                  <dd>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {analyticsData.total_jobs}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        jobsChange.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {jobsChange.isPositive ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        )}
                        <span className="ml-1">{jobsChange.value}%</span>
                      </div>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Candidates */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Candidates</dt>
                  <dd>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {analyticsData.total_candidates}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        candidatesChange.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {candidatesChange.isPositive ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        )}
                        <span className="ml-1">{candidatesChange.value}%</span>
                      </div>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Total Applications</dt>
                  <dd>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {analyticsData.total_applications}
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        applicationsChange.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {applicationsChange.isPositive ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        )}
                        <span className="ml-1">{applicationsChange.value}%</span>
                      </div>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Time to Fill */}
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-6 w-6 text-gray-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">Avg. Time to Fill</dt>
                  <dd>
                    <div className="flex items-baseline">
                      <div className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {analyticsData.time_to_fill} days
                      </div>
                      <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                        timeToFillChange.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {timeToFillChange.isPositive ? (
                          <ArrowTrendingUpIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        ) : (
                          <ArrowTrendingDownIcon className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                        )}
                        <span className="ml-1">{timeToFillChange.value}%</span>
                      </div>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hiring Trends Chart */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Hiring Trends</h3>
          <div className="mt-4 h-64">
            {/* In a real application, we would use a chart library like Chart.js or Recharts */}
            <div className="h-full flex items-end space-x-2">
              {analyticsData.hiring_trends.map((trend: HiringTrend, index: number) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div className="relative w-full flex flex-col items-center space-y-1">
                    <div 
                      className="w-full bg-blue-100 dark:bg-blue-900" 
                      style={{ height: `${(trend.applications / 70) * 100}%` }}
                    ></div>
                    <div 
                      className="w-full bg-indigo-200 dark:bg-indigo-800" 
                      style={{ height: `${(trend.interviews / 70) * 100}%` }}
                    ></div>
                    <div 
                      className="w-full bg-green-200 dark:bg-green-800" 
                      style={{ height: `${(trend.hires / 70) * 100}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">{trend.month}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-center space-x-8">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900 mr-2"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Applications</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-indigo-200 dark:bg-indigo-800 mr-2"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Interviews</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-200 dark:bg-green-800 mr-2"></div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Hires</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Diversity Metrics */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Gender Diversity */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Gender Diversity</h3>
            <div className="mt-4">
              {Object.entries(analyticsData.diversity_metrics.gender).map(([gender, value], index) => (
                <div key={index} className="mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{gender}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{value}%</div>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ethnicity Diversity */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Ethnicity Diversity</h3>
            <div className="mt-4">
              {Object.entries(analyticsData.diversity_metrics.ethnicity).map(([ethnicity, value], index) => (
                <div key={index} className="mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{ethnicity}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{value}%</div>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Age Group Diversity */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Age Group Diversity</h3>
            <div className="mt-4">
              {Object.entries(analyticsData.diversity_metrics.age_groups).map(([ageGroup, value], index) => (
                <div key={index} className="mt-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{ageGroup}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{value}%</div>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
