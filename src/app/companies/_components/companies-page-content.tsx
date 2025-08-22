'use client';

import { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CompanyListDB } from '@/app/companies/_components/company-list-db';
import { CompanyFilters } from '@/app/companies/_components/company-filters';
import { CompanyHybridSearch } from '@/app/companies/_components/company-hybrid-search';
import { BDKanban } from '@/components/bd-kanban';
import { ICPBuilder } from '@/components/icp-builder';
import { CSVImporter } from '@/components/csv-importer';
import { 
  MagnifyingGlassIcon, 
  ViewColumnsIcon,
  DocumentArrowUpIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

type ViewMode = 'discover' | 'pipeline';

// Default ICP profile
const DEFAULT_ICP = {
  name: 'High-Growth Tech Startups',
  description: 'Early-stage tech companies (Seed/Series A) with 11-200 employees experiencing rapid growth and high hiring urgency',
  industries: ['Technology', 'SaaS'],
  company_size_min: 11,
  company_size_max: 200,
  growth_stage: ['seed', 'series-a'],
  hiring_urgency: 'high',
  partner_status: ['lead', 'prospect']
};

export function CompaniesPageContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<ViewMode>('discover');
  const [showICPBuilder, setShowICPBuilder] = useState(false);
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [currentICP, setCurrentICP] = useState(DEFAULT_ICP);
  const [showFilters, setShowFilters] = useState(false);

  // Check URL params on mount and when they change
  useEffect(() => {
    const view = searchParams.get('view');
    if (view === 'pipeline') {
      setViewMode('pipeline');
    } else if (view === 'discover') {
      setViewMode('discover');
    }
  }, [searchParams]);

  const handleICPSave = async (criteria: any) => {
    // Update current ICP
    setCurrentICP({
      name: criteria.name,
      description: criteria.description,
      industries: criteria.industries,
      company_size_min: criteria.company_size_min,
      company_size_max: criteria.company_size_max,
      growth_stage: criteria.growth_stage || [],
      hiring_urgency: criteria.hiring_urgency || 'medium',
      partner_status: criteria.partner_status || ['lead', 'prospect']
    });
    setShowICPBuilder(false);
    // Show success toast
    alert('ICP Profile updated successfully!');
  };

  const handleCSVImport = async (data: any[]) => {
    const response = await fetch('/api/companies/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companies: data })
    });
    
    if (!response.ok) {
      throw new Error('Import failed');
    }
    
    // Refresh the page or update the list
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Hero section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Business Development Hub</h1>
              {/* View Mode Toggle */}
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('discover')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    viewMode === 'discover'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-blue-500 bg-opacity-30 text-white hover:bg-opacity-40'
                  }`}
                >
                  Discover
                </button>
                <button
                  onClick={() => setViewMode('pipeline')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm ${
                    viewMode === 'pipeline'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'bg-blue-500 bg-opacity-30 text-white hover:bg-opacity-40'
                  }`}
                >
                  Pipeline
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowCSVImporter(true)}
              className="px-3 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2 text-sm"
            >
              <DocumentArrowUpIcon className="h-4 w-4" />
              Import CSV
            </button>
          </div>
          
          {/* Compact ICP Summary */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SparklesIcon className="h-5 w-5 text-yellow-300 flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">ICP:</span>
                    <span className="text-white">{currentICP.name}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {currentICP.industries.map((industry) => (
                      <span key={industry} className="px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs text-white">
                        {industry}
                      </span>
                    ))}
                    <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs text-white">
                      {currentICP.company_size_min}-{currentICP.company_size_max} emp
                    </span>
                    <span className="px-2 py-0.5 bg-white bg-opacity-20 rounded text-xs text-white">
                      {currentICP.hiring_urgency} urgency
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowICPBuilder(true)}
                className="ml-4 px-3 py-1.5 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-all flex items-center gap-1 text-sm"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
            </div>
          </div>
          
          {viewMode === 'discover' && (
            <div className="bg-white p-3 rounded-lg shadow-lg">
              <CompanyHybridSearch />
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 min-h-[calc(100vh-64px)]">
        {viewMode === 'discover' ? (
          <div className="flex gap-4 h-full">
            {/* Filters Panel - Sticky sidebar */}
            {showFilters && (
              <div className="w-56 bg-gray-900 text-white rounded-lg shadow-2xl border border-gray-700 flex-shrink-0">
                <div className="p-2.5 bg-gray-800 rounded-t-lg flex justify-between items-center">
                  <h3 className="font-semibold text-sm">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
                <div className="p-3">
                  <CompanyFilters />
                </div>
              </div>
            )}
            
            {/* Results Panel */}
            <div className="flex-1 min-h-[calc(100vh-200px)]">
              <div className="bg-white rounded-xl shadow-sm h-full flex flex-col">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center flex-shrink-0">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      Potential Partners
                    </h2>
                    <p className="text-gray-600 text-sm">Companies matching your ICP with active hiring needs</p>
                  </div>
                  {!showFilters && (
                    <button
                      onClick={() => setShowFilters(true)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all flex items-center gap-2 text-sm"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      Show Filters
                    </button>
                  )}
                </div>
                <div className="p-5 flex-1 overflow-y-auto">
                  <Suspense fallback={
                    <div className="flex justify-center items-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  }>
                    <CompanyListDB />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            {/* ICP Summary for Pipeline View */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <SparklesIcon className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Active ICP Profile</h3>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-1">{currentICP.name}</h4>
                  <p className="text-gray-600 text-sm mb-3">{currentICP.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {currentICP.industries.map((industry) => (
                      <span key={industry} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs font-medium">
                        {industry}
                      </span>
                    ))}
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-xs font-medium">
                      {currentICP.company_size_min}-{currentICP.company_size_max} employees
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md text-xs font-medium">
                      {currentICP.hiring_urgency} urgency
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowICPBuilder(true)}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit ICP
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm p-6 overflow-hidden">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">BD Pipeline</h2>
                <p className="text-gray-600">Track and manage your business development opportunities through each stage</p>
              </div>
              <BDKanban />
            </div>
          </div>
        )}
      </div>
      
      {/* ICP Builder Modal */}
      {showICPBuilder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <ICPBuilder
              onSave={handleICPSave}
              onCancel={() => setShowICPBuilder(false)}
              initialValues={currentICP}
            />
          </div>
        </div>
      )}
      
      {/* CSV Importer Modal */}
      {showCSVImporter && (
        <CSVImporter
          type="companies"
          onImport={handleCSVImport}
          onClose={() => setShowCSVImporter(false)}
        />
      )}
    </div>
  );
}