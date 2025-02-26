'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Job } from '@/types';

// Mock data for jobs
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'We are looking for a skilled Frontend Developer...',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    salary_range: '$90,000 - $120,000',
    experience_level: 'Mid Level',
    skills: ['React', 'TypeScript', 'CSS', 'HTML'],
    status: 'published',
    created_at: '2023-01-15T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z',
    created_by: 'user1',
  },
  {
    id: '2',
    title: 'Backend Engineer',
    description: 'Join our team as a Backend Engineer...',
    company: 'DataSystems',
    location: 'New York, NY',
    salary_range: '$100,000 - $140,000',
    experience_level: 'Senior',
    skills: ['Node.js', 'Python', 'SQL', 'MongoDB'],
    status: 'published',
    created_at: '2023-02-20T00:00:00Z',
    updated_at: '2023-02-20T00:00:00Z',
    created_by: 'user1',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    description: 'Looking for a Full Stack Developer with experience...',
    company: 'WebSolutions',
    location: 'Remote',
    salary_range: '$80,000 - $110,000',
    experience_level: 'Mid Level',
    skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    status: 'draft',
    created_at: '2023-03-10T00:00:00Z',
    updated_at: '2023-03-10T00:00:00Z',
    created_by: 'user1',
  },
  {
    id: '4',
    title: 'DevOps Engineer',
    description: 'Join our DevOps team to build and maintain...',
    company: 'CloudTech',
    location: 'Seattle, WA',
    salary_range: '$120,000 - $150,000',
    experience_level: 'Senior',
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    status: 'published',
    created_at: '2023-04-05T00:00:00Z',
    updated_at: '2023-04-05T00:00:00Z',
    created_by: 'user1',
  },
  {
    id: '5',
    title: 'UX Designer',
    description: 'We are seeking a talented UX Designer...',
    company: 'DesignHub',
    location: 'Austin, TX',
    salary_range: '$85,000 - $115,000',
    experience_level: 'Mid Level',
    skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping'],
    status: 'closed',
    created_at: '2023-05-12T00:00:00Z',
    updated_at: '2023-05-12T00:00:00Z',
    created_by: 'user1',
  },
];

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Job>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<Job['status'] | 'all'>('all');

  const handleSort = (field: keyof Job) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDelete = (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job posting?')) {
      setJobs(jobs.filter((job) => job.id !== jobId));
    }
  };

  const filteredJobs = jobs
    .filter((job) => 
      (statusFilter === 'all' || job.status === statusFilter) &&
      (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
       job.location.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = sortField ? a[sortField] : null;
      const bValue = sortField ? b[sortField] : null;
      
      if (aValue !== undefined && aValue !== null && bValue !== undefined && bValue !== null && aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue !== undefined && aValue !== null && bValue !== undefined && bValue !== null && aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Jobs</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Manage your job postings
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="mt-4 inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:mt-0"
        >
          <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          New Job
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                className="input-field pl-10"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Job['status'] | 'all')}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                  onClick={() => handleSort('title')}
                >
                  <div className="flex items-center">
                    Title
                    {sortField === 'title' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                  onClick={() => handleSort('location')}
                >
                  <div className="flex items-center">
                    Location
                    {sortField === 'location' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                  onClick={() => handleSort('experience_level')}
                >
                  <div className="flex items-center">
                    Experience
                    {sortField === 'experience_level' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {sortField === 'status' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 cursor-pointer"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center">
                    Date
                    {sortField === 'created_at' && (
                      sortDirection === 'asc' ? 
                        <ChevronUpIcon className="ml-1 h-4 w-4" /> : 
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{job.title}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{job.company}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{job.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500 dark:text-gray-400">{job.experience_level}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === 'published'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : job.status === 'draft'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/jobs/${job.id}`}
                          className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                        >
                          <EyeIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <Link
                          href={`/jobs/${job.id}/edit`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <PencilIcon className="h-5 w-5" aria-hidden="true" />
                        </Link>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <TrashIcon className="h-5 w-5" aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No jobs found. Create a new job posting to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
