import { Suspense } from 'react';
import { CompaniesPageContent } from '@/app/companies/_components/companies-page-content';

export default function CompaniesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <CompaniesPageContent />
    </Suspense>
  );
}