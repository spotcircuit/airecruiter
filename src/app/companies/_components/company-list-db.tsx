'use client';

import { useEffect, useState } from 'react';
import { BuildingOfficeIcon, MapPinIcon, UsersIcon, ArrowPathIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

type Company = {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
  partner_status: string;
  hiring_urgency?: string;
  hiring_volume?: number;
  growth_stage?: string;
  active_jobs_count?: string;
  contacts_count?: string;
  signals?: any;
};

export function CompanyListDB() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/companies');
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setCompanies(data.companies || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch companies:', err);
      setError('Failed to load companies. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const addToPipeline = async (companyId: string, companyName: string) => {
    try {
      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_id: companyId,
          name: `${companyName} - Partnership Opportunity`,
          stage: 'prospect',
          value: 50000,
          probability: 30,
          next_step: 'Schedule discovery call'
        })
      });
      
      if (response.ok) {
        alert(`Added ${companyName} to BD pipeline!`);
        // Update the company's partner status locally
        setCompanies(prev => prev.map(c => 
          c.id === companyId ? { ...c, partner_status: 'prospect' } : c
        ));
      }
    } catch (error) {
      console.error('Error adding to pipeline:', error);
      alert('Failed to add to pipeline');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ArrowPathIcon className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading companies from database...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button 
              onClick={fetchCompanies}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
        <p className="mt-1 text-sm text-gray-500">Start by adding companies to your database.</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{companies.length}</span> companies from database
        </p>
        <button
          onClick={fetchCompanies}
          className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
        >
          <ArrowPathIcon className="h-4 w-4" />
          Refresh
        </button>
      </div>

      <div className="bg-white shadow-md overflow-hidden rounded-xl">
        <ul role="list" className="divide-y divide-gray-100">
          {companies.map((company) => (
            <li key={company.id} className="hover:bg-blue-50 group transition-colors duration-150">
              <div className="px-6 py-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center">
                        <BuildingOfficeIcon className="h-6 w-6 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                            {company.name}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(company.partner_status)}`}>
                            {company.partner_status}
                          </span>
                          {company.hiring_urgency && (
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getUrgencyColor(company.hiring_urgency)}`}>
                              {company.hiring_urgency} urgency
                            </span>
                          )}
                          {company.growth_stage && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {company.growth_stage}
                            </span>
                          )}
                        </div>
                        
                        <div className="mt-2 flex items-center gap-4 text-sm text-gray-600">
                          {company.industry && (
                            <div className="flex items-center">
                              <span className="font-medium">Industry:</span>
                              <span className="ml-1">{company.industry}</span>
                            </div>
                          )}
                          {company.location && (
                            <div className="flex items-center">
                              <MapPinIcon className="h-4 w-4 mr-1" />
                              {company.location}
                            </div>
                          )}
                          {company.size && (
                            <div className="flex items-center">
                              <UsersIcon className="h-4 w-4 mr-1" />
                              {company.size} employees
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex items-center gap-6 text-sm">
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Active Jobs:</span>
                            <span className="font-semibold text-gray-900">{company.active_jobs_count || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-gray-500">Contacts:</span>
                            <span className="font-semibold text-gray-900">{company.contacts_count || 0}</span>
                          </div>
                          {company.hiring_volume && (
                            <div className="flex items-center gap-1">
                              <span className="text-gray-500">Hiring Volume:</span>
                              <span className="font-semibold text-gray-900">{company.hiring_volume}</span>
                            </div>
                          )}
                        </div>

                        {company.signals && company.signals.tech_stack && (
                          <div className="mt-3">
                            <span className="text-xs text-gray-500">Tech Stack:</span>
                            <div className="mt-1 flex flex-wrap gap-1">
                              {company.signals.tech_stack.map((tech: string, idx: number) => (
                                <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    {company.partner_status === 'lead' && (
                      <button
                        onClick={() => addToPipeline(company.id, company.name)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-1" />
                        Add to Pipeline
                      </button>
                    )}
                    <a
                      href={`/companies/${company.id}`}
                      className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      View Details →
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}