'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import JobPostingForm from '@/components/JobPostingForm';

export default function NewJobPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // In a real application, this would be an API call to create a job
      console.log('Creating new job:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to jobs page after successful creation
      router.push('/jobs');
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link
          href="/jobs"
          className="inline-flex items-center rounded-md text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ArrowLeftIcon className="mr-1 h-5 w-5" aria-hidden="true" />
          Back to Jobs
        </Link>
      </div>
      
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Create New Job</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fill out the form below to create a new job posting
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="p-6">
          <JobPostingForm onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
      </div>
    </div>
  );
}
