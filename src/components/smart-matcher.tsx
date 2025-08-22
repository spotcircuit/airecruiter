'use client';

import { useState } from 'react';
import { 
  SparklesIcon,
  LightBulbIcon,
  CheckCircleIcon,
  XCircleIcon,
  UserIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface MatchCriteria {
  skills: { name: string; weight: number; required: boolean }[];
  experience: { min: number; max: number; weight: number };
  education: { level: string; field?: string; weight: number };
  location: { cities: string[]; remote: boolean; weight: number };
  salary: { min: number; max: number; weight: number };
  culture: string[];
  availability: 'immediate' | '2weeks' | '1month' | 'flexible';
}

interface Candidate {
  id: string;
  name: string;
  title: string;
  skills: string[];
  experience: number;
  education: string;
  location: string;
  salary: number;
  availability: string;
  matchScore?: number;
  matchReasons?: string[];
}

export function SmartMatcher() {
  const [criteria, setCriteria] = useState<MatchCriteria>({
    skills: [
      { name: 'React', weight: 0.9, required: true },
      { name: 'TypeScript', weight: 0.8, required: true },
      { name: 'Node.js', weight: 0.7, required: false },
      { name: 'AWS', weight: 0.5, required: false }
    ],
    experience: { min: 3, max: 8, weight: 0.7 },
    education: { level: 'Bachelor', weight: 0.3 },
    location: { cities: ['San Francisco', 'Remote'], remote: true, weight: 0.5 },
    salary: { min: 120000, max: 180000, weight: 0.6 },
    culture: ['collaborative', 'innovative', 'fast-paced'],
    availability: 'immediate'
  });

  const [matchingMode, setMatchingMode] = useState<'strict' | 'balanced' | 'flexible'>('balanced');
  const [showExplanation, setShowExplanation] = useState(true);

  // Mock candidates
  const candidates: Candidate[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      title: 'Senior Frontend Developer',
      skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
      experience: 5,
      education: 'BS Computer Science',
      location: 'San Francisco',
      salary: 150000,
      availability: 'immediate'
    },
    {
      id: '2',
      name: 'Michael Rodriguez',
      title: 'Full Stack Engineer',
      skills: ['React', 'JavaScript', 'Node.js', 'Python', 'Docker'],
      experience: 4,
      education: 'BS Software Engineering',
      location: 'Remote',
      salary: 130000,
      availability: '2 weeks'
    },
    {
      id: '3',
      name: 'Emily Johnson',
      title: 'React Developer',
      skills: ['React', 'TypeScript', 'CSS', 'Jest', 'Redux'],
      experience: 3,
      education: 'Bootcamp Graduate',
      location: 'New York',
      salary: 110000,
      availability: '1 month'
    }
  ];

  // Advanced matching algorithm
  const calculateMatch = (candidate: Candidate): { score: number; reasons: string[] } => {
    let totalScore = 0;
    let totalWeight = 0;
    const reasons: string[] = [];

    // Skills matching with partial credit
    const skillScore = criteria.skills.reduce((acc, skill) => {
      const hasSkill = candidate.skills.some(s => 
        s.toLowerCase().includes(skill.name.toLowerCase())
      );
      
      if (hasSkill) {
        if (skill.required) {
          reasons.push(`✅ Has required skill: ${skill.name}`);
        } else {
          reasons.push(`➕ Has preferred skill: ${skill.name}`);
        }
        return acc + skill.weight;
      } else if (skill.required && matchingMode === 'strict') {
        reasons.push(`❌ Missing required skill: ${skill.name}`);
        return 0; // Disqualify in strict mode
      }
      return acc;
    }, 0);
    
    const maxSkillScore = criteria.skills.reduce((acc, s) => acc + s.weight, 0);
    totalScore += (skillScore / maxSkillScore) * criteria.skills[0].weight;
    totalWeight += criteria.skills[0].weight;

    // Experience matching with tolerance
    const expDiff = Math.abs(candidate.experience - (criteria.experience.min + criteria.experience.max) / 2);
    const expRange = criteria.experience.max - criteria.experience.min;
    let expScore = Math.max(0, 1 - (expDiff / expRange));
    
    if (candidate.experience >= criteria.experience.min && candidate.experience <= criteria.experience.max) {
      reasons.push(`✅ Experience matches: ${candidate.experience} years`);
      expScore = 1;
    } else if (Math.abs(candidate.experience - criteria.experience.min) <= 1) {
      reasons.push(`⚠️ Close to experience range: ${candidate.experience} years`);
      expScore = 0.8;
    }
    
    totalScore += expScore * criteria.experience.weight;
    totalWeight += criteria.experience.weight;

    // Location matching
    const locationMatch = criteria.location.cities.some(city => 
      candidate.location.toLowerCase().includes(city.toLowerCase())
    ) || (criteria.location.remote && candidate.location.toLowerCase() === 'remote');
    
    if (locationMatch) {
      reasons.push(`✅ Location matches: ${candidate.location}`);
      totalScore += criteria.location.weight;
    } else if (matchingMode === 'flexible') {
      reasons.push(`⚠️ Different location but may relocate`);
      totalScore += criteria.location.weight * 0.5;
    }
    totalWeight += criteria.location.weight;

    // Salary matching
    if (candidate.salary >= criteria.salary.min && candidate.salary <= criteria.salary.max) {
      reasons.push(`✅ Salary in range: $${(candidate.salary / 1000).toFixed(0)}k`);
      totalScore += criteria.salary.weight;
    } else {
      const salaryDiff = Math.min(
        Math.abs(candidate.salary - criteria.salary.min),
        Math.abs(candidate.salary - criteria.salary.max)
      );
      const salaryScore = Math.max(0, 1 - (salaryDiff / criteria.salary.max));
      totalScore += salaryScore * criteria.salary.weight;
      
      if (salaryScore > 0.7) {
        reasons.push(`⚠️ Salary close to range: $${(candidate.salary / 1000).toFixed(0)}k`);
      }
    }
    totalWeight += criteria.salary.weight;

    // Availability bonus
    if (candidate.availability === 'immediate' && criteria.availability === 'immediate') {
      reasons.push(`🚀 Available immediately`);
      totalScore += 0.1; // Bonus
    }

    const finalScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;
    
    return {
      score: Math.min(1, finalScore) * 100,
      reasons
    };
  };

  // Calculate matches for all candidates
  const matchedCandidates = candidates.map(candidate => {
    const match = calculateMatch(candidate);
    return {
      ...candidate,
      matchScore: match.score,
      matchReasons: match.reasons
    };
  }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100';
    if (score >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
    if (score >= 60) return <LightBulbIcon className="h-5 w-5 text-yellow-600" />;
    return <XCircleIcon className="h-5 w-5 text-red-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <SparklesIcon className="h-6 w-6 mr-2 text-purple-600" />
              Smart Candidate Matcher
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              AI-powered matching with explainable scoring
            </p>
          </div>
          
          {/* Matching Mode Selector */}
          <div className="flex gap-2">
            {(['strict', 'balanced', 'flexible'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setMatchingMode(mode)}
                className={`px-4 py-2 rounded-lg capitalize transition-all ${
                  matchingMode === mode
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Current Criteria Summary */}
        <div className="bg-purple-50 rounded-lg p-4">
          <h3 className="font-medium text-purple-900 mb-3">Matching Criteria</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700">
                {criteria.experience.min}-{criteria.experience.max} years exp
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700">
                {criteria.location.cities.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700">
                ${criteria.salary.min / 1000}k-${criteria.salary.max / 1000}k
              </span>
            </div>
            <div className="flex items-center gap-2">
              <AcademicCapIcon className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700">
                {criteria.education.level}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700">
                Start: {criteria.availability}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-purple-600" />
              <span className="text-purple-700">
                {criteria.skills.filter(s => s.required).length} required skills
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Matched Candidates */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">
            Matched Candidates ({matchedCandidates.length})
          </h3>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-sm text-purple-600 hover:text-purple-700"
          >
            {showExplanation ? 'Hide' : 'Show'} Explanations
          </button>
        </div>

        <div className="space-y-4">
          {matchedCandidates.map((candidate) => (
            <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-medium text-gray-900">{candidate.name}</h4>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getScoreColor(candidate.matchScore || 0)}`}>
                      {getScoreIcon(candidate.matchScore || 0)}
                      {Math.round(candidate.matchScore || 0)}% Match
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-2">{candidate.title}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                    <span className="flex items-center gap-1">
                      <BriefcaseIcon className="h-4 w-4" />
                      {candidate.experience} years
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {candidate.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      ${(candidate.salary / 1000).toFixed(0)}k
                    </span>
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {candidate.availability}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {candidate.skills.map((skill, index) => {
                      const isRequired = criteria.skills.some(s => 
                        s.required && s.name.toLowerCase() === skill.toLowerCase()
                      );
                      return (
                        <span 
                          key={index}
                          className={`px-2 py-1 rounded text-xs ${
                            isRequired 
                              ? 'bg-green-100 text-green-700 font-medium'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {skill}
                        </span>
                      );
                    })}
                  </div>

                  {showExplanation && candidate.matchReasons && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Match Explanation:</p>
                      <div className="space-y-1">
                        {candidate.matchReasons.map((reason, index) => (
                          <p key={index} className="text-xs text-gray-600">{reason}</p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="ml-4">
                  <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Matching Algorithm Explanation */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">How Our Smart Matching Works</h4>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start">
              <SparklesIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
              <span>Multi-factor scoring: Skills, experience, location, salary, and availability</span>
            </li>
            <li className="flex items-start">
              <SparklesIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
              <span>Weighted criteria: Prioritize what matters most for each role</span>
            </li>
            <li className="flex items-start">
              <SparklesIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
              <span>Flexible matching modes: Strict for must-haves, Flexible for best-fit</span>
            </li>
            <li className="flex items-start">
              <SparklesIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
              <span>Explainable AI: Understand why each candidate matched</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}