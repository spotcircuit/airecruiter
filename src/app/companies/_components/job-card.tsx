'use client';

import Link from 'next/link';
import { BriefcaseIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

type JobCardProps = {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  type: string;
  postedDate: string;
  logo?: string;
  isFeatured?: boolean;
};

export function JobCard({
  id,
  title,
  company,
  location,
  salary,
  type,
  postedDate,
  logo,
  isFeatured = false,
}: JobCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-md ${
      isFeatured ? 'border-l-4 border-blue-500' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {logo ? (
                <img className="h-12 w-12 rounded-md object-cover" src={logo} alt={`${company} logo`} />
              ) : (
                <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center">
                  <BuildingOfficeIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center">
                <h3 className="text-lg font-medium text-gray-900 truncate">
                <Link href={`/companies/jobs/${id}`} className="hover:text-blue-600">
                  {title}
                </Link>
              </h3>
                {isFeatured && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-gray-600 mt-1">{company}</p>
              
              <div className="mt-2 flex flex-wrap gap-2">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {location}
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center text-sm text-gray-500">
                  <CurrencyDollarIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {salary}
                </div>
                <span className="text-gray-300">•</span>
                <div className="flex items-center text-sm text-gray-500">
                  <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {type}
                </div>
              </div>
              
              <div className="mt-3 flex flex-wrap gap-2">
                {['Full-time', 'Remote', 'Mid Level'].map((tag) => (
                  <span key={tag} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end">
            <p className="text-sm text-gray-500">Posted {postedDate}</p>
            <Link 
              href={`/companies/jobs/${id}`}
              className="mt-2 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View Details
            </Link>
          </div>
        </div>
        
        <div className="mt-4 sm:hidden flex items-center justify-between">
          <p className="text-sm text-gray-500">Posted {postedDate}</p>
          <Link 
            href={`/companies/jobs/${id}`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
