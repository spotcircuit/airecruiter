import { Suspense } from 'react';
import { JobCard } from '../_components/job-card';
import { JobFilters } from '../_components/job-filters';
import { JobSearch } from '../_components/job-search';

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  isFeatured?: boolean;
};

// Mock data - replace with actual API call
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechStart Inc.',
    location: 'San Francisco, CA (Remote)',
    salary: '$120,000 - $150,000',
    type: 'Full-time',
    postedDate: '2 days ago',
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'TechStart Inc.',
    location: 'San Francisco, CA',
    salary: '$130,000 - $160,000',
    type: 'Full-time',
    postedDate: '1 week ago',
  },
  {
    id: '3',
    title: 'UX/UI Designer',
    company: 'DesignHub',
    location: 'New York, NY (Hybrid)',
    salary: '$90,000 - $120,000',
    type: 'Full-time',
    postedDate: '3 days ago',
    isFeatured: true,
  },
  {
    id: '4',
    title: 'Backend Engineer',
    company: 'DataSystems',
    location: 'Remote',
    salary: '$110,000 - $140,000',
    type: 'Full-time',
    postedDate: '5 days ago',
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    location: 'Austin, TX (Remote)',
    salary: '$130,000 - $160,000',
    type: 'Full-time',
    postedDate: '1 day ago',
  },
];

export default function JobsPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Openings</h1>
          <p className="mt-2 text-lg text-gray-600">
            Browse through our latest job opportunities
          </p>
        </div>

        <div className="mb-6">
          <JobSearch />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <JobFilters />
          </div>
          
          <div className="lg:w-3/4">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {mockJobs.length} jobs found
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Jobs are updated daily
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <select
                    id="sort"
                    name="sort"
                    className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue="most-recent"
                  >
                    <option value="most-recent">Most Recent</option>
                    <option value="salary-high">Salary: High to Low</option>
                    <option value="salary-low">Salary: Low to High</option>
                    <option value="relevance">Relevance</option>
                  </select>
                </div>
              </div>
            </div>

            <Suspense fallback={<div>Loading jobs...</div>}>
              <div className="space-y-4">
                {mockJobs.map((job) => (
                  <JobCard key={job.id} {...job} />
                ))}
              </div>

              {/* Pagination */}
              <nav
                className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-8"
                aria-label="Pagination"
              >
                <div className="hidden sm:block">
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                    <span className="font-medium">24</span> results
                  </p>
                </div>
                <div className="flex-1 flex justify-between sm:justify-end space-x-3">
                  <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    disabled
                  >
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    Next
                  </button>
                </div>
              </nav>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
