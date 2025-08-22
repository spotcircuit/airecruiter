'use client';

import { useState } from 'react';
import { Suspense } from 'react';
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
  AdjustmentsHorizontalIcon 
} from '@heroicons/react/24/outline';

type ViewMode = 'discover' | 'pipeline';

export default function CompaniesPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('discover');
  const [showICPBuilder, setShowICPBuilder] = useState(false);
  const [showCSVImporter, setShowCSVImporter] = useState(false);

  const handleICPSave = async (criteria: any) => {
    // TODO: Save ICP to database
    console.log('Saving ICP:', criteria);
    setShowICPBuilder(false);
    // Show success toast
    alert('ICP Profile saved successfully!');
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
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-4xl font-bold">Business Development Hub</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowICPBuilder(true)}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2"
              >
                <AdjustmentsHorizontalIcon className="h-5 w-5" />
                ICP Builder
              </button>
              <button
                onClick={() => setShowCSVImporter(true)}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2"
              >
                <DocumentArrowUpIcon className="h-5 w-5" />
                Import CSV
              </button>
            </div>
          </div>
          <p className="text-blue-100 mb-8 text-xl max-w-3xl">
            {viewMode === 'discover' 
              ? 'Discover companies with active hiring needs that match your recruiting expertise'
              : 'Manage your BD pipeline and track partnership opportunities'}
          </p>
          
          {/* View Mode Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode('discover')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                viewMode === 'discover'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-blue-500 bg-opacity-30 text-white hover:bg-opacity-40'
              }`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Discover Companies
            </button>
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 ${
                viewMode === 'pipeline'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'bg-blue-500 bg-opacity-30 text-white hover:bg-opacity-40'
              }`}
            >
              <ViewColumnsIcon className="h-5 w-5" />
              BD Pipeline
            </button>
          </div>
          
          {viewMode === 'discover' && (
            <div className="bg-white p-4 rounded-xl shadow-lg">
              <CompanyHybridSearch />
            </div>
          )}
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {viewMode === 'discover' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-5 sticky top-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                  Partnership Filters
                </h2>
                <CompanyFilters />
              </div>
            </div>
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-sm p-5 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  Potential Partners
                </h2>
                <p className="text-gray-600 mb-4">These companies are actively looking for recruiting partners or have immediate hiring needs that match your expertise.</p>
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
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">BD Pipeline</h2>
              <p className="text-gray-600">Track and manage your business development opportunities through each stage</p>
            </div>
            <BDKanban />
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