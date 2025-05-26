import { Suspense } from 'react';
import { CompanyList } from '@/app/companies/_components/company-list';
import { CompanyFilters } from '@/app/companies/_components/company-filters';
import { CompanyHybridSearch } from '@/app/companies/_components/company-hybrid-search';

export default function CompaniesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-3">Find Partnership Opportunities</h1>
          <p className="text-blue-100 mb-8 text-xl max-w-3xl">Discover companies with active hiring needs that match your recruiting expertise and build valuable B2B relationships</p>
          
          <div className="bg-white p-4 rounded-xl shadow-lg">
            <CompanyHybridSearch />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
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
                <CompanyList />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
