'use client';

import { useState, useEffect } from 'react';
import { BriefcaseIcon, UserGroupIcon, ArrowRightIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface Deal {
  id: string;
  name: string;
  stage: string;
  value?: number;
  company_name?: string;
  updated_at: string;
}

interface Submission {
  id: string;
  candidate_name: string;
  job_title: string;
  stage: string;
  match_score?: number;
  updated_at: string;
}

const dealStages = [
  { key: 'prospect', label: 'Prospect', color: 'bg-gray-100' },
  { key: 'discovery', label: 'Discovery', color: 'bg-blue-100' },
  { key: 'proposal', label: 'Proposal', color: 'bg-yellow-100' },
  { key: 'won', label: 'Won', color: 'bg-green-100' },
];

const candidateStages = [
  { key: 'new', label: 'New', color: 'bg-gray-100' },
  { key: 'screening', label: 'Screening', color: 'bg-blue-100' },
  { key: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-100' },
  { key: 'interviewed', label: 'Interviewed', color: 'bg-yellow-100' },
  { key: 'offered', label: 'Offered', color: 'bg-green-100' },
];

export default function PipelinePage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDealValue: 0,
    activeDeals: 0,
    totalCandidates: 0,
    placementRate: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dealsRes, submissionsRes] = await Promise.all([
        fetch('/api/deals'),
        fetch('/api/submissions').catch(() => ({ json: async () => ({ submissions: [] }) }))
      ]);

      const dealsData = await dealsRes.json();
      const submissionsData = await submissionsRes.json();

      setDeals(dealsData.deals || []);
      setSubmissions(submissionsData.submissions || getMockSubmissions());

      // Calculate stats
      const totalValue = (dealsData.deals || [])
        .filter((d: Deal) => d.stage === 'won')
        .reduce((sum: number, d: Deal) => sum + (d.value || 0), 0);
      
      setStats({
        totalDealValue: totalValue,
        activeDeals: (dealsData.deals || []).filter((d: Deal) => !['won', 'lost'].includes(d.stage)).length,
        totalCandidates: submissionsData.submissions?.length || 0,
        placementRate: 23 // Mock for now
      });
    } catch (error) {
      console.error('Error fetching pipeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMockSubmissions = (): Submission[] => {
    return [
      {
        id: '1',
        candidate_name: 'John Smith',
        job_title: 'Senior Developer',
        stage: 'new',
        match_score: 92,
        updated_at: new Date().toISOString()
      },
      {
        id: '2',
        candidate_name: 'Sarah Johnson',
        job_title: 'Product Manager',
        stage: 'screening',
        match_score: 88,
        updated_at: new Date().toISOString()
      },
      {
        id: '3',
        candidate_name: 'Mike Chen',
        job_title: 'DevOps Engineer',
        stage: 'shortlisted',
        match_score: 95,
        updated_at: new Date().toISOString()
      },
      {
        id: '4',
        candidate_name: 'Emily Davis',
        job_title: 'UX Designer',
        stage: 'interviewed',
        match_score: 87,
        updated_at: new Date().toISOString()
      },
      {
        id: '5',
        candidate_name: 'Alex Wilson',
        job_title: 'Data Scientist',
        stage: 'offered',
        match_score: 91,
        updated_at: new Date().toISOString()
      }
    ];
  };

  const getDealsByStage = (stage: string) => deals.filter(d => d.stage === stage);
  const getSubmissionsByStage = (stage: string) => submissions.filter(s => s.stage === stage);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Unified Pipeline</h1>
              <p className="text-gray-600 mt-1">Manage BD deals and candidates in one view</p>
            </div>
            <button
              onClick={fetchData}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                ${(stats.totalDealValue / 1000).toFixed(0)}k
              </div>
              <div className="text-sm text-gray-600">Won Deal Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.activeDeals}</div>
              <div className="text-sm text-gray-600">Active Deals</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalCandidates}</div>
              <div className="text-sm text-gray-600">Active Candidates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.placementRate}%</div>
              <div className="text-sm text-gray-600">Placement Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Pipeline */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* BD Pipeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <BriefcaseIcon className="h-6 w-6 text-blue-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">BD Pipeline</h2>
              <span className="ml-auto text-sm text-gray-500">{deals.length} deals</span>
            </div>
            
            <div className="space-y-4">
              {dealStages.map(stage => {
                const stageDeals = getDealsByStage(stage.key);
                return (
                  <div key={stage.key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                      <span className="text-sm text-gray-500">{stageDeals.length}</span>
                    </div>
                    <div className="space-y-2">
                      {stageDeals.length > 0 ? (
                        stageDeals.slice(0, 3).map(deal => (
                          <div key={deal.id} className={`${stage.color} p-3 rounded-lg`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {deal.name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {deal.company_name || 'Unknown Company'}
                                </div>
                              </div>
                              {deal.value && (
                                <div className="text-sm font-semibold text-gray-700">
                                  ${(deal.value / 1000).toFixed(0)}k
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
                          <span className="text-xs text-gray-400">No deals in {stage.label}</span>
                        </div>
                      )}
                      {stageDeals.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{stageDeals.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Candidate Pipeline */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <UserGroupIcon className="h-6 w-6 text-purple-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Candidate Pipeline</h2>
              <span className="ml-auto text-sm text-gray-500">{submissions.length} candidates</span>
            </div>
            
            <div className="space-y-4">
              {candidateStages.map(stage => {
                const stageCandidates = getSubmissionsByStage(stage.key);
                return (
                  <div key={stage.key}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{stage.label}</span>
                      <span className="text-sm text-gray-500">{stageCandidates.length}</span>
                    </div>
                    <div className="space-y-2">
                      {stageCandidates.length > 0 ? (
                        stageCandidates.slice(0, 3).map(submission => (
                          <div key={submission.id} className={`${stage.color} p-3 rounded-lg`}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate">
                                  {submission.candidate_name}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {submission.job_title}
                                </div>
                              </div>
                              {submission.match_score && (
                                <div className="flex items-center">
                                  <div className="text-sm font-semibold text-gray-700">
                                    {submission.match_score}%
                                  </div>
                                  <div className="ml-2 w-12 bg-gray-200 rounded-full h-2">
                                    <div 
                                      className="bg-green-500 h-2 rounded-full"
                                      style={{ width: `${submission.match_score}%` }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 text-center">
                          <span className="text-xs text-gray-400">No candidates in {stage.label}</span>
                        </div>
                      )}
                      {stageCandidates.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{stageCandidates.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Flow</h3>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">BD Pipeline</span>
                <span className="text-sm text-gray-600">Candidate Pipeline</span>
              </div>
              <div className="relative">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <ArrowRightIcon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500">Prospects → Wins</span>
                <span className="text-xs text-gray-500">Applications → Placements</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}