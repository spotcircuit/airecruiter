'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon, 
  EyeIcon,
  EnvelopeIcon,
  PhoneIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { Candidate } from '@/types';

// Mock data for candidates
const mockCandidates: Candidate[] = [
  {
    id: '1',
    user_id: 'user1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    resume_url: '/resumes/john-smith.pdf',
    linkedin_url: 'https://linkedin.com/in/johnsmith',
    skills: ['JavaScript', 'React', 'Node.js', 'TypeScript'],
    experience: [
      {
        id: 'exp1',
        company: 'Tech Solutions Inc.',
        title: 'Senior Frontend Developer',
        start_date: '2020-01-01',
        end_date: undefined,
        current: true,
        description: 'Leading frontend development for enterprise applications.'
      },
      {
        id: 'exp2',
        company: 'Web Innovations',
        title: 'Frontend Developer',
        start_date: '2017-03-01',
        end_date: '2019-12-31',
        current: false,
        description: 'Developed responsive web applications using React.'
      }
    ],
    education: [
      {
        id: 'edu1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        start_date: '2013-09-01',
        end_date: '2017-05-31',
        current: false
      }
    ],
    match_score: 92,
    status: 'shortlisted',
    created_at: '2023-01-10T00:00:00Z',
    updated_at: '2023-01-15T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '(555) 987-6543',
    location: 'New York, NY',
    resume_url: '/resumes/sarah-johnson.pdf',
    linkedin_url: 'https://linkedin.com/in/sarahjohnson',
    skills: ['UI/UX Design', 'Figma', 'Adobe XD', 'User Research'],
    experience: [
      {
        id: 'exp3',
        company: 'Design Studio',
        title: 'UX Designer',
        start_date: '2019-06-01',
        end_date: undefined,
        current: true,
        description: 'Creating user-centered designs for web and mobile applications.'
      },
      {
        id: 'exp4',
        company: 'Creative Agency',
        title: 'UI Designer',
        start_date: '2017-02-01',
        end_date: '2019-05-31',
        current: false,
        description: 'Designed interfaces for client websites and applications.'
      }
    ],
    education: [
      {
        id: 'edu2',
        institution: 'Rhode Island School of Design',
        degree: 'Bachelor of Fine Arts',
        field: 'Graphic Design',
        start_date: '2013-09-01',
        end_date: '2017-05-31',
        current: false
      }
    ],
    match_score: 88,
    status: 'new',
    created_at: '2023-02-05T00:00:00Z',
    updated_at: '2023-02-05T00:00:00Z'
  },
  {
    id: '3',
    user_id: 'user3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '(555) 456-7890',
    location: 'Austin, TX',
    resume_url: '/resumes/michael-brown.pdf',
    linkedin_url: 'https://linkedin.com/in/michaelbrown',
    skills: ['Python', 'Django', 'SQL', 'AWS'],
    experience: [
      {
        id: 'exp5',
        company: 'Data Systems Inc.',
        title: 'Backend Developer',
        start_date: '2018-04-01',
        end_date: undefined,
        current: true,
        description: 'Developing scalable backend services using Python and Django.'
      },
      {
        id: 'exp6',
        company: 'Tech Startup',
        title: 'Junior Developer',
        start_date: '2016-07-01',
        end_date: '2018-03-31',
        current: false,
        description: 'Full stack development for early-stage startup.'
      }
    ],
    education: [
      {
        id: 'edu3',
        institution: 'University of Texas at Austin',
        degree: 'Master of Science',
        field: 'Computer Science',
        start_date: '2014-09-01',
        end_date: '2016-05-31',
        current: false
      }
    ],
    match_score: 85,
    status: 'interviewed',
    created_at: '2023-03-12T00:00:00Z',
    updated_at: '2023-03-20T00:00:00Z'
  },
  {
    id: '4',
    user_id: 'user4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    phone: '(555) 789-0123',
    location: 'Chicago, IL',
    resume_url: '/resumes/emily-davis.pdf',
    linkedin_url: 'https://linkedin.com/in/emilydavis',
    skills: ['Product Management', 'Agile', 'User Stories', 'Roadmapping'],
    experience: [
      {
        id: 'exp7',
        company: 'Product Innovations',
        title: 'Product Manager',
        start_date: '2019-01-01',
        end_date: undefined,
        current: true,
        description: 'Managing product roadmap and coordinating with development teams.'
      },
      {
        id: 'exp8',
        company: 'Tech Solutions',
        title: 'Associate Product Manager',
        start_date: '2017-06-01',
        end_date: '2018-12-31',
        current: false,
        description: 'Assisted in product planning and feature prioritization.'
      }
    ],
    education: [
      {
        id: 'edu4',
        institution: 'Northwestern University',
        degree: 'Bachelor of Science',
        field: 'Business Administration',
        start_date: '2013-09-01',
        end_date: '2017-05-31',
        current: false
      }
    ],
    match_score: 79,
    status: 'new',
    created_at: '2023-04-18T00:00:00Z',
    updated_at: '2023-04-18T00:00:00Z'
  },
  {
    id: '5',
    user_id: 'user5',
    name: 'David Wilson',
    email: 'david.wilson@example.com',
    phone: '(555) 234-5678',
    location: 'Seattle, WA',
    resume_url: '/resumes/david-wilson.pdf',
    linkedin_url: 'https://linkedin.com/in/davidwilson',
    skills: ['DevOps', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
    experience: [
      {
        id: 'exp9',
        company: 'Cloud Technologies',
        title: 'DevOps Engineer',
        start_date: '2020-03-01',
        end_date: undefined,
        current: true,
        description: 'Managing cloud infrastructure and CI/CD pipelines.'
      },
      {
        id: 'exp10',
        company: 'Tech Corp',
        title: 'Systems Administrator',
        start_date: '2017-08-01',
        end_date: '2020-02-29',
        current: false,
        description: 'Managed on-premise and cloud infrastructure.'
      }
    ],
    education: [
      {
        id: 'edu5',
        institution: 'University of Washington',
        degree: 'Bachelor of Science',
        field: 'Information Technology',
        start_date: '2013-09-01',
        end_date: '2017-06-30',
        current: false
      }
    ],
    match_score: 76,
    status: 'shortlisted',
    created_at: '2023-05-22T00:00:00Z',
    updated_at: '2023-05-25T00:00:00Z'
  }
];

export default function CandidatesPage() {
  const [candidates] = useState<Candidate[]>(mockCandidates);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField] = useState<keyof Candidate>('match_score');
  const [sortDirection] = useState<'asc' | 'desc'>('desc');
  const [statusFilter, setStatusFilter] = useState<Candidate['status'] | 'all'>('all');

  const filteredCandidates = candidates
    .filter((candidate) => 
      (statusFilter === 'all' || candidate.status === statusFilter) &&
      (candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
       candidate.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())))
    )
    .sort((a, b) => {
      if (sortField === 'match_score') {
        return sortDirection === 'asc' 
          ? (a.match_score || 0) - (b.match_score || 0)
          : (b.match_score || 0) - (a.match_score || 0);
      }
      
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue && bValue && aValue < bValue) {
        return sortDirection === 'asc' ? -1 : 1;
      }
      if (aValue && bValue && aValue > bValue) {
        return sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Candidates</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          View and manage candidate profiles
        </p>
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
                placeholder="Search candidates by name, email, or skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                className="input-field"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Candidate['status'] | 'all')}
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="interviewed">Interviewed</option>
                <option value="offered">Offered</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map((candidate) => (
              <div
                key={candidate.id}
                className="bg-white dark:bg-gray-700 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600 overflow-hidden"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {candidate.name}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {candidate.experience[0]?.title || 'No title'}
                      </p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          candidate.status === 'new'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : candidate.status === 'shortlisted'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : candidate.status === 'interviewed'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            : candidate.status === 'offered'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}
                      >
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </span>
                      {candidate.match_score && (
                        <div className="mt-2 flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 dark:bg-gray-700 mr-1">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{ width: `${candidate.match_score}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {candidate.match_score}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <EnvelopeIcon className="h-4 w-4 mr-2" />
                      <span>{candidate.email}</span>
                    </div>
                    {candidate.phone && (
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <PhoneIcon className="h-4 w-4 mr-2" />
                        <span>{candidate.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      <span>Applied {new Date(candidate.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Skills</h4>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {candidate.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-600 px-4 py-3 bg-gray-50 dark:bg-gray-800">
                  <div className="flex justify-between">
                    <Link
                      href={`/candidates/${candidate.id}`}
                      className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      View Profile
                    </Link>
                    <div className="flex space-x-2">
                      <button
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        Shortlist
                      </button>
                      <button
                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        Schedule
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                No candidates found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
