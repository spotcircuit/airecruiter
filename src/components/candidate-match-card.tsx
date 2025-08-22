'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface MatchReason {
  category: string;
  score: number;
  details: string[];
  weight: number;
}

interface CandidateMatchCardProps {
  candidateId: string;
  candidateName: string;
  candidateTitle?: string;
  candidateLocation?: string;
  matchScore: number;
  matchReasons?: MatchReason[];
  skills?: string[];
  experience?: number;
  expectedSalary?: { min: number; max: number };
}

export function CandidateMatchCard({
  candidateId,
  candidateName,
  candidateTitle,
  candidateLocation,
  matchScore,
  matchReasons = [],
  skills = [],
  experience,
  expectedSalary,
}: CandidateMatchCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  // Generate default match reasons if not provided
  const defaultReasons: MatchReason[] = matchReasons.length > 0 ? matchReasons : [
    {
      category: 'Skills Match',
      score: 85,
      weight: 0.4,
      details: [
        '✓ React (5+ years)',
        '✓ Node.js (4+ years)',
        '✓ TypeScript (3+ years)',
        '⚠ AWS (limited experience)',
      ],
    },
    {
      category: 'Experience Level',
      score: 90,
      weight: 0.3,
      details: [
        '✓ 7 years total experience',
        '✓ Senior-level roles',
        '✓ Team lead experience',
      ],
    },
    {
      category: 'Location & Availability',
      score: 95,
      weight: 0.2,
      details: [
        '✓ Located in target area',
        '✓ Open to hybrid work',
        '✓ Available immediately',
      ],
    },
    {
      category: 'Compensation Fit',
      score: 80,
      weight: 0.1,
      details: [
        '⚠ Salary expectations 10% above budget',
        '✓ Open to negotiation',
      ],
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 70) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getOverallScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const renderDetailIcon = (detail: string) => {
    if (detail.includes('✓')) {
      return <CheckCircleIcon className="h-4 w-4 text-green-500 flex-shrink-0" />;
    } else if (detail.includes('⚠')) {
      return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 flex-shrink-0" />;
    } else if (detail.includes('✗')) {
      return <XCircleIcon className="h-4 w-4 text-red-500 flex-shrink-0" />;
    }
    return null;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{candidateName}</h3>
            {candidateTitle && (
              <p className="text-sm text-gray-600">{candidateTitle}</p>
            )}
            {candidateLocation && (
              <p className="text-xs text-gray-500 mt-1">{candidateLocation}</p>
            )}
          </div>
          
          <div className="flex flex-col items-end">
            <div className="relative">
              <div className="w-20 h-20">
                <svg className="transform -rotate-90 w-20 h-20">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(matchScore / 100) * 226} 226`}
                    className={getOverallScoreColor(matchScore)}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">{matchScore}%</span>
                </div>
              </div>
            </div>
            <span className="text-xs text-gray-500 mt-1">Match Score</span>
          </div>
        </div>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className="mt-4 w-full flex items-center justify-between px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
        >
          <span className="text-sm font-medium">
            {showDetails ? 'Hide' : 'Show'} Match Explanation
          </span>
          {showDetails ? (
            <ChevronUpIcon className="h-4 w-4" />
          ) : (
            <ChevronDownIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {showDetails && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Why {matchScore}% Match?</h4>
          
          <div className="space-y-3">
            {defaultReasons.map((reason, index) => (
              <div key={index} className="bg-white rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-medium text-gray-900">{reason.category}</h5>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      Weight: {(reason.weight * 100).toFixed(0)}%
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(reason.score)}`}>
                      {reason.score}%
                    </span>
                  </div>
                </div>
                
                <div className="space-y-1">
                  {reason.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-start gap-2 text-xs text-gray-600">
                      {renderDetailIcon(detail)}
                      <span>{detail.replace(/[✓✗⚠]/g, '').trim()}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {skills.length > 0 && (
            <div className="mt-4">
              <h5 className="text-xs font-semibold text-gray-700 mb-2">Matched Skills:</h5>
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 8).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {skill}
                  </span>
                ))}
                {skills.length > 8 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{skills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}

          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            {experience && (
              <div className="bg-white rounded p-2">
                <span className="text-gray-500">Experience:</span>
                <span className="ml-1 font-medium text-gray-900">{experience} years</span>
              </div>
            )}
            {expectedSalary && (
              <div className="bg-white rounded p-2">
                <span className="text-gray-500">Expected:</span>
                <span className="ml-1 font-medium text-gray-900">
                  ${(expectedSalary.min / 1000).toFixed(0)}k-${(expectedSalary.max / 1000).toFixed(0)}k
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <h5 className="text-xs font-semibold text-gray-700 mb-2">Risk Factors:</h5>
            <div className="space-y-1 text-xs">
              <div className="flex items-start gap-2 text-yellow-700">
                <ExclamationTriangleIcon className="h-4 w-4 flex-shrink-0" />
                <span>Salary expectations slightly above budget range</span>
              </div>
              <div className="flex items-start gap-2 text-green-700">
                <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                <span>No employment gaps detected</span>
              </div>
              <div className="flex items-start gap-2 text-green-700">
                <CheckCircleIcon className="h-4 w-4 flex-shrink-0" />
                <span>Stable work history (avg 2.5 years per role)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <button className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
              View Full Profile
            </button>
            <button className="flex-1 px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50">
              Generate Brief
            </button>
          </div>
        </div>
      )}
    </div>
  );
}