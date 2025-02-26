'use client';

import { useState } from 'react';
import { 
  UserIcon, 
  DocumentTextIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import ResumeParser from '@/components/ResumeParser';
import { useNotification } from '@/contexts/NotificationContext';

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone?: string;
  education: {
    institution: string;
    degree: string;
    field?: string;
    startDate?: string;
    endDate?: string;
    gpa?: number;
  }[];
  experience: {
    company: string;
    title: string;
    location?: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    highlights?: string[];
  }[];
  skills: string[];
  summary?: string;
  links?: {
    type: 'linkedin' | 'github' | 'portfolio' | 'other';
    url: string;
  }[];
  matchScore?: number;
  status?: 'pending' | 'reviewing' | 'approved' | 'rejected';
}

interface Job {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  minimumExperience: number;
  location: string;
  department: string;
  status: 'open' | 'closed' | 'draft';
  createdAt: string;
}

export default function CandidateScreeningPage(): JSX.Element {
  const { showNotification } = useNotification();
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Mock job data
  const jobs: Job[] = [
    {
      id: 'job-1',
      title: 'Senior Frontend Developer',
      description: 'We are looking for an experienced Frontend Developer with expertise in React, TypeScript, and modern web technologies to join our team. The ideal candidate will have a strong understanding of UI/UX principles and be able to build responsive, accessible web applications.',
      requiredSkills: ['React', 'TypeScript', 'JavaScript', 'HTML', 'CSS'],
      preferredSkills: ['Next.js', 'Tailwind CSS', 'GraphQL', 'Testing'],
      minimumExperience: 4,
      location: 'Remote',
      department: 'Engineering',
      status: 'open',
      createdAt: '2025-01-15T00:00:00Z',
    },
    {
      id: 'job-2',
      title: 'Machine Learning Engineer',
      description: 'We are seeking a Machine Learning Engineer to develop and implement ML models and algorithms. The ideal candidate will have experience with Python, TensorFlow, and PyTorch, as well as a strong understanding of data structures and algorithms.',
      requiredSkills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning'],
      preferredSkills: ['Deep Learning', 'NLP', 'Computer Vision', 'AWS'],
      minimumExperience: 3,
      location: 'San Francisco, CA',
      department: 'AI Research',
      status: 'open',
      createdAt: '2025-02-01T00:00:00Z',
    },
    {
      id: 'job-3',
      title: 'DevOps Engineer',
      description: 'We are looking for a DevOps Engineer to help us build and maintain our infrastructure. The ideal candidate will have experience with cloud platforms, containerization, and CI/CD pipelines.',
      requiredSkills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
      preferredSkills: ['Terraform', 'Ansible', 'Prometheus', 'Grafana'],
      minimumExperience: 2,
      location: 'New York, NY',
      department: 'Infrastructure',
      status: 'open',
      createdAt: '2025-02-10T00:00:00Z',
    },
  ];

  const handleJobSelect = (job: Job): void => {
    setSelectedJob(job);
  };

  const handleCandidateParsed = (candidate: Candidate): void => {
    // Generate a unique ID for the candidate
    const newCandidate: Candidate = {
      ...candidate,
      id: `candidate-${Date.now()}`,
      status: 'pending',
    };
    
    setCandidates((prev) => [...prev, newCandidate]);
    showNotification('success', 'Resume Parsed', 'Candidate resume has been successfully parsed and added to the screening list.');
  };

  const analyzeAllCandidates = async (): Promise<void> => {
    if (!selectedJob) return;
    
    setIsAnalyzing(true);
    
    try {
      // In a real implementation, you would send a request to your API
      // to analyze all candidates against the selected job
      
      // For demo purposes, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      setCandidates((prev) => 
        prev.map((candidate) => {
          // Calculate a match score based on skills
          const requiredSkillsMatch = candidate.skills.filter((skill) => 
            selectedJob.requiredSkills.includes(skill)
          ).length;
          
          const preferredSkillsMatch = candidate.skills.filter((skill) => 
            selectedJob.preferredSkills.includes(skill)
          ).length;
          
          const requiredSkillsScore = requiredSkillsMatch / selectedJob.requiredSkills.length;
          const preferredSkillsScore = preferredSkillsMatch / selectedJob.preferredSkills.length;
          
          // Calculate experience years (simplified)
          const experienceYears = candidate.experience.reduce((total, exp) => {
            if (!exp.startDate || !exp.endDate) return total;
            
            const startYear = parseInt(exp.startDate.split('-')[0]);
            const endYear = exp.endDate === 'Present' 
              ? new Date().getFullYear() 
              : parseInt(exp.endDate.split('-')[0]);
            
            return total + (endYear - startYear);
          }, 0);
          
          const experienceScore = Math.min(experienceYears / selectedJob.minimumExperience, 1);
          
          // Calculate overall match score (weighted)
          const matchScore = Math.round(
            (requiredSkillsScore * 0.6 + preferredSkillsScore * 0.2 + experienceScore * 0.2) * 100
          );
          
          // Determine status based on match score
          let status: 'pending' | 'reviewing' | 'approved' | 'rejected' = 'pending';
          if (matchScore >= 80) {
            status = 'approved';
          } else if (matchScore >= 60) {
            status = 'reviewing';
          } else {
            status = 'rejected';
          }
          
          return {
            ...candidate,
            matchScore,
            status,
          };
        })
      );
      
      showNotification('success', 'Analysis Complete', 'All candidates have been analyzed against the selected job.');
    } catch (error) {
      showNotification('error', 'Analysis Failed', 'Failed to analyze candidates. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'approved':
        return 'text-green-500 bg-green-100 dark:bg-green-900/20 dark:text-green-400';
      case 'reviewing':
        return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-500 bg-red-100 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string): JSX.Element => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500 dark:text-green-400" />;
      case 'reviewing':
        return <ChartBarIcon className="h-5 w-5 text-yellow-500 dark:text-yellow-400" />;
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />;
      default:
        return <UserIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />;
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Candidate Screening</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Upload and analyze candidate resumes against open job positions to find the best matches.
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Job Positions</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Select a job position to screen candidates against
              </p>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {jobs.map((job) => (
                <li key={job.id}>
                  <button
                    type="button"
                    className={`w-full px-4 py-4 flex items-start hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition duration-150 ease-in-out ${
                      selectedJob?.id === job.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    }`}
                    onClick={() => handleJobSelect(job)}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {job.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {job.department} • {job.location}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {job.requiredSkills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {job.requiredSkills.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                            +{job.requiredSkills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {selectedJob && (
            <div className="mt-6">
              <ResumeParser 
                onParsed={handleCandidateParsed} 
                jobTitle={selectedJob.title}
                jobDescription={selectedJob.description}
              />
            </div>
          )}
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">Candidates</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {candidates.length} candidate{candidates.length !== 1 ? 's' : ''} uploaded
                </p>
              </div>
              {candidates.length > 0 && selectedJob && (
                <button
                  type="button"
                  onClick={analyzeAllCandidates}
                  disabled={isAnalyzing}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAnalyzing ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze All Candidates'
                  )}
                </button>
              )}
            </div>
            
            {candidates.length === 0 ? (
              <div className="px-4 py-12 text-center">
                <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No candidates</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Upload candidate resumes to start screening.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {candidates.map((candidate) => (
                  <li key={candidate.id} className="px-4 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center min-w-0">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        </div>
                        <div className="ml-4 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {candidate.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {candidate.email}
                          </p>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {candidate.skills.slice(0, 5).map((skill, index) => (
                              <span
                                key={index}
                                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                  selectedJob?.requiredSkills.includes(skill)
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                    : selectedJob?.preferredSkills.includes(skill)
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {skill}
                              </span>
                            ))}
                            {candidate.skills.length > 5 && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                +{candidate.skills.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0 flex items-center">
                        {candidate.matchScore !== undefined && (
                          <div className="mr-4 text-center">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              Match
                            </div>
                            <div className={`text-lg font-bold ${
                              candidate.matchScore >= 80
                                ? 'text-green-500 dark:text-green-400'
                                : candidate.matchScore >= 60
                                ? 'text-yellow-500 dark:text-yellow-400'
                                : 'text-red-500 dark:text-red-400'
                            }`}>
                              {candidate.matchScore}%
                            </div>
                          </div>
                        )}
                        {candidate.status && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(candidate.status)}`}>
                            {getStatusIcon(candidate.status)}
                            <span className="ml-1 capitalize">{candidate.status}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
