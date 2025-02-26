'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusIcon, MinusIcon } from '@heroicons/react/24/outline';

const jobSchema = z.object({
  title: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company name is required'),
  location: z.string().min(1, 'Location is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  salaryMin: z.string().optional(),
  salaryMax: z.string().optional(),
  experienceLevel: z.string().min(1, 'Experience level is required'),
  skills: z.array(z.string()).min(1, 'At least one skill is required'),
});

type JobFormData = z.infer<typeof jobSchema>;

interface JobPostingFormProps {
  onSubmit: (data: JobFormData) => void;
  initialData?: Partial<JobFormData>;
  isLoading?: boolean;
}

export default function JobPostingForm({
  onSubmit,
  initialData,
  isLoading = false,
}: JobPostingFormProps) {
  const [skills, setSkills] = useState<string[]>(initialData?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: initialData?.title || '',
      company: initialData?.company || '',
      location: initialData?.location || '',
      description: initialData?.description || '',
      salaryMin: initialData?.salaryMin || '',
      salaryMax: initialData?.salaryMax || '',
      experienceLevel: initialData?.experienceLevel || '',
      skills: initialData?.skills || [],
    },
  });

  const addSkill = () => {
    if (newSkill.trim() !== '' && !skills.includes(newSkill.trim())) {
      const updatedSkills = [...skills, newSkill.trim()];
      setSkills(updatedSkills);
      setValue('skills', updatedSkills);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    const updatedSkills = skills.filter((skill) => skill !== skillToRemove);
    setSkills(updatedSkills);
    setValue('skills', updatedSkills);
  };

  const generateJobDescription = async () => {
    if (!skills.length || !initialData?.title) return;

    setIsGeneratingDescription(true);

    try {
      const response = await fetch('/api/generate-job-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: initialData.title,
          skills,
        }),
      });

      const data = await response.json();

      if (data.jobDescription) {
        setValue('description', data.jobDescription);
      }
    } catch (error) {
      console.error('Error generating job description:', error);
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-white dark:from-gray-800 dark:to-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
            <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
          </svg>
          {initialData?.title ? 'Edit Job Posting' : 'Create New Job Posting'}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Fill out the form below to {initialData?.title ? 'update' : 'create'} your job posting
        </p>
      </div>
    
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700 mb-4">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full" style={{ width: '25%' }}></div>
        </div>
        
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
          <div className="col-span-1">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Job Title
            </label>
            <input
              type="text"
              id="title"
              {...register('title')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g. Frontend Developer"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="company"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Company
            </label>
            <input
              type="text"
              id="company"
              {...register('company')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Your company name"
            />
            {errors.company && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.company.message}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              {...register('location')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="e.g. Remote, New York, NY"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.location.message}
              </p>
            )}
          </div>

          <div className="col-span-1">
            <label
              htmlFor="experienceLevel"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Experience Level
            </label>
            <select
              id="experienceLevel"
              {...register('experienceLevel')}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">Select experience level</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior">Senior</option>
              <option value="Lead">Lead</option>
              <option value="Executive">Executive</option>
            </select>
            {errors.experienceLevel && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.experienceLevel.message}
              </p>
            )}
          </div>

          <div className="col-span-2 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label
                htmlFor="salaryMin"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Minimum Salary (optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  id="salaryMin"
                  {...register('salaryMin')}
                  className="w-full rounded-lg border border-gray-300 pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. 50,000"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="salaryMax"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Maximum Salary (optional)
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="text"
                  id="salaryMax"
                  {...register('salaryMax')}
                  className="w-full rounded-lg border border-gray-300 pl-7 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g. 80,000"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Required Skills
            </label>
            <div className="mt-1 flex">
              <input
                type="text"
                id="skills"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="flex-1 rounded-l-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Add a skill and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center px-4 py-2 rounded-r-lg border border-transparent text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Skill
              </button>
            </div>
            {errors.skills && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.skills.message}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Controller
                control={control}
                name="skills"
                render={({ field }) => (
                  <>
                    {skills.length === 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 italic">No skills added yet</p>
                    )}
                    {skills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center rounded-full bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 px-3 py-1.5 text-sm text-primary-800 dark:from-primary-900/30 dark:to-primary-800/30 dark:border-primary-800 dark:text-primary-300"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="ml-2 text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-200 focus:outline-none"
                        >
                          <MinusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <input type="hidden" {...field} value={skills} />
                  </>
                )}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Job Description
              </label>
              <button
                type="button"
                onClick={generateJobDescription}
                disabled={isGeneratingDescription || skills.length === 0 || !initialData?.title}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 disabled:opacity-50 shadow-sm transition-colors duration-200"
              >
                {isGeneratingDescription ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <div className="mt-1 rounded-lg border border-gray-300 overflow-hidden focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500 dark:border-gray-600">
              <textarea
                id="description"
                {...register('description')}
                rows={8}
                className="block w-full border-0 px-4 py-3 resize-none focus:outline-none focus:ring-0 dark:bg-gray-700 dark:text-white"
                placeholder="Describe the job responsibilities, requirements, benefits, and company culture..."
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Tip: Be specific about job responsibilities and requirements to attract qualified candidates
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-8">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Save as Draft
          </button>
          <div className="flex space-x-3">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-primary-300 text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-primary-300 dark:border-primary-700 dark:hover:bg-gray-700"
            >
              Preview
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  Publish Job Posting
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
