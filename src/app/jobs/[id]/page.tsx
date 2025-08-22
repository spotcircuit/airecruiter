'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  CheckIcon,
  DocumentTextIcon,
  StarIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';
import { Job, Company, Submission, Candidate } from '@/types/database';

interface JobDetailsData {
  id: string;
  title: string;
  company_id?: string;
  company_name?: string;
  company_domain?: string;
  company_industry?: string;
  department?: string;
  location?: string;
  location_type?: string;
  employment_type?: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  jd_text?: string;
  requirements?: string[];
  nice_to_haves?: string[];
  status: string;
  created_at: string;
  updated_at: string;
}

interface SubmissionWithCandidate extends Submission {
  candidate_name?: string;
  candidate_email?: string;
  candidate_title?: string;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<JobDetailsData | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionWithCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [submissionsLoading, setSubmissionsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    fetchSubmissions();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error('Job not found');
      }
      const jobData = await response.json();
      setJob(jobData);
    } catch (err) {
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(`/api/submissions?job_id=${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data.submissions || []);
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/jobs');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete job');
      }
    } catch (error) {
      alert('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApply = async () => {
    // This would typically open a form or redirect to application page
    setApplying(true);
    // Simulate application process
    setTimeout(() => {
      setApplying(false);
      alert('Application submitted successfully!');
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'hired': return 'bg-green-100 text-green-800';
      case 'offered': return 'bg-blue-100 text-blue-800';
      case 'interviewed': return 'bg-purple-100 text-purple-800';
      case 'shortlisted': return 'bg-yellow-100 text-yellow-800';
      case 'screening': return 'bg-orange-100 text-orange-800';
      case 'new': return 'bg-gray-100 text-gray-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationTypeIcon = (locationType?: string) => {
    switch (locationType) {
      case 'remote': return '🏠';
      case 'hybrid': return '🏢';
      case 'on-site': return '🏢';
      default: return '📍';
    }
  };

  const formatSalary = (min?: number, max?: number, currency = 'USD') => {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()} ${currency}`;
    if (min) return `$${min.toLocaleString()}+ ${currency}`;
    if (max) return `Up to $${max.toLocaleString()} ${currency}`;
    return 'Salary not specified';
  };

  const formatMatchScore = (score?: number) => {
    if (!score) return 'N/A';
    return `${Math.round(score * 100)}%`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <BriefcaseIcon className="h-10 w-10" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{job.title}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </div>
                {job.company_name && (
                  <div className="flex items-center gap-2 mb-3">
                    <BuildingOfficeIcon className="h-5 w-5 text-blue-100" />
                    <button
                      onClick={() => router.push(`/companies/${job.company_id}`)}
                      className="text-blue-100 hover:text-white text-lg transition-colors"
                    >
                      {job.company_name}
                    </button>
                  </div>
                )}
                <div className="flex items-center gap-6 text-blue-100 flex-wrap">
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <span>{getLocationTypeIcon(job.location_type)}</span>
                      <MapPinIcon className="h-4 w-4" />
                      {job.location} ({job.location_type || 'On-site'})
                    </div>
                  )}
                  {job.employment_type && (
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {job.employment_type}
                    </div>
                  )}
                  {(job.salary_min || job.salary_max) && (
                    <div className="flex items-center gap-1">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              {job.status === 'published' && (
                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50 transition-colors"
                >
                  {applying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Applying...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Apply Now
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() => router.push(`/jobs/${jobId}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                Job Description
              </h2>
              
              {job.jd_text ? (
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700">{job.jd_text}</div>
                </div>
              ) : (
                <p className="text-gray-500">No job description provided</p>
              )}
            </div>

            {/* Requirements & Nice-to-Haves */}
            {(job.requirements?.length || job.nice_to_haves?.length) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Requirements */}
                {job.requirements?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                    <ul className="space-y-2">
                      {job.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Nice-to-Haves */}
                {job.nice_to_haves?.length > 0 && (
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nice-to-Haves</h3>
                    <ul className="space-y-2">
                      {job.nice_to_haves.map((nth, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <StarIcon className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{nth}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Matched Candidates */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-purple-500 mr-2" />
                  Matched Candidates ({submissions.length})
                </h2>
                <button
                  onClick={() => router.push(`/candidates?job_id=${jobId}`)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  Find More Candidates
                </button>
              </div>
              
              {submissionsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                </div>
              ) : submissions.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No candidates matched yet</p>
              ) : (
                <div className="space-y-4">
                  {submissions.map(submission => (
                    <div key={submission.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <UserIcon className="h-5 w-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">
                                {submission.candidate_name || 'Anonymous Candidate'}
                              </h3>
                              {submission.candidate_title && (
                                <p className="text-sm text-gray-600">{submission.candidate_title}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            {submission.candidate_email && (
                              <div className="flex items-center gap-1">
                                <EnvelopeIcon className="h-3 w-3" />
                                {submission.candidate_email}
                              </div>
                            )}
                            {submission.match_score && (
                              <div className="flex items-center gap-1">
                                <StarIcon className="h-3 w-3 text-yellow-500" />
                                {formatMatchScore(submission.match_score)} match
                              </div>
                            )}
                          </div>

                          {submission.match_reasons && submission.match_reasons.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs text-gray-500 mb-1">Match reasons:</p>
                              <div className="flex flex-wrap gap-1">
                                {submission.match_reasons.slice(0, 3).map((reason, index) => {
                                  let label: string;
                                  if (typeof reason === 'string' || typeof reason === 'number') {
                                    label = String(reason);
                                  } else if (reason && typeof reason === 'object') {
                                    const r = (reason as any).reason ?? (reason as any).message ?? '';
                                    const w = (reason as any).weight;
                                    label = r ? (w != null ? `${r} (${Math.round(Number(w) * 100)}%)` : r) : JSON.stringify(reason);
                                  } else {
                                    label = String(reason);
                                  }
                                  return (
                                    <span key={index} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-xs">
                                      {label}
                                    </span>
                                  );
                                })}
                                {submission.match_reasons.length > 3 && (
                                  <span className="px-2 py-0.5 text-gray-500 text-xs">
                                    +{submission.match_reasons.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStageColor(submission.stage)}`}>
                            {submission.stage}
                          </span>
                          <button
                            onClick={() => router.push(`/candidates/${submission.candidate_id}`)}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Job Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Job Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Information</h2>
              
              <div className="space-y-4">
                {job.department && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <p className="text-gray-900">{job.department}</p>
                  </div>
                )}
                
                {job.experience_level && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
                    <p className="text-gray-900">{job.experience_level}</p>
                  </div>
                )}
                
                {job.employment_type && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Employment Type</label>
                    <p className="text-gray-900">{job.employment_type}</p>
                  </div>
                )}
                
                {job.location_type && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Work Arrangement</label>
                    <p className="text-gray-900">{job.location_type}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Posted</label>
                  <p className="text-gray-900">{new Date(job.created_at).toLocaleDateString()}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <p className="text-gray-900">{new Date(job.updated_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>

            {/* Company Info */}
            {job.company_name && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">About the Company</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{job.company_name}</h3>
                      {job.company_industry && (
                        <p className="text-sm text-gray-600">{job.company_industry}</p>
                      )}
                    </div>
                  </div>
                  
                  {job.company_domain && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                      <a
                        href={`https://${job.company_domain}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <LinkIcon className="h-4 w-4" />
                        {job.company_domain}
                      </a>
                    </div>
                  )}
                  
                  <button
                    onClick={() => router.push(`/companies/${job.company_id}`)}
                    className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Company Profile
                  </button>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/jobs/${jobId}/edit`)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Job Details
                </button>
                
                <button
                  onClick={() => router.push(`/candidates?job_id=${jobId}`)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                >
                  <UserGroupIcon className="h-4 w-4" />
                  Find Candidates
                </button>
                
                <button
                  onClick={() => window.open(`mailto:?subject=Job Opportunity: ${job.title}&body=Check out this job opportunity: ${window.location.href}`)}
                  className="w-full flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  Share Job
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}