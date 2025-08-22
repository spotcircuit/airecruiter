'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import {
  SparklesIcon,
  ArrowLeftIcon,
  BriefcaseIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/react/24/outline';
import { Company, Job } from '@/types/database';

interface FormData {
  company_id: string;
  title: string;
  department: string;
  location: string;
  location_type: string;
  employment_type: string;
  experience_level: string;
  salary_min: number | '';
  salary_max: number | '';
  jd_text: string;
  requirements: string[];
  nice_to_haves: string[];
  status: 'draft' | 'published';
}

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const [formData, setFormData] = useState<FormData>({
    company_id: '',
    title: '',
    department: '',
    location: '',
    location_type: 'on-site',
    employment_type: 'full-time',
    experience_level: 'mid',
    salary_min: '',
    salary_max: '',
    jd_text: '',
    requirements: [''],
    nice_to_haves: [''],
    status: 'draft'
  });

  useEffect(() => {
    fetchJob();
    fetchCompanies();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (!response.ok) {
        throw new Error('Job not found');
      }
      const jobData = await response.json();
      setJob(jobData);
      
      // Populate form data
      setFormData({
        company_id: jobData.company_id || '',
        title: jobData.title || '',
        department: jobData.department || '',
        location: jobData.location || '',
        location_type: jobData.location_type || 'on-site',
        employment_type: jobData.employment_type || 'full-time',
        experience_level: jobData.experience_level || 'mid',
        salary_min: jobData.salary_min || '',
        salary_max: jobData.salary_max || '',
        jd_text: jobData.jd_text || '',
        requirements: jobData.requirements?.length > 0 ? jobData.requirements : [''],
        nice_to_haves: jobData.nice_to_haves?.length > 0 ? jobData.nice_to_haves : [''],
        status: jobData.status || 'draft'
      });
    } catch (error) {
      console.error('Error fetching job:', error);
      setErrors({ fetch: 'Failed to load job data' });
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies');
      const data = await response.json();
      setCompanies(data.companies || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
    }
  };

  const generateJobDescription = async () => {
    if (!formData.title || !formData.company_id) {
      setErrors({ ai_generation: 'Please enter a job title and select a company first' });
      return;
    }

    setIsGenerating(true);
    setErrors({});

    try {
      const selectedCompany = companies.find(c => c.id === formData.company_id);
      const response = await fetch('/api/generate-job-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          company: selectedCompany?.name || '',
          industry: selectedCompany?.industry || '',
          experience_level: formData.experience_level,
          employment_type: formData.employment_type,
          location: formData.location
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          jd_text: data.description,
          requirements: data.requirements || prev.requirements,
          nice_to_haves: data.nice_to_haves || prev.nice_to_haves
        }));
      } else {
        setErrors({ ai_generation: data.error || 'Failed to generate job description' });
      }
    } catch (error) {
      setErrors({ ai_generation: 'Failed to generate job description' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleArrayInputChange = (field: 'requirements' | 'nice_to_haves', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'nice_to_haves') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'nice_to_haves', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company_id) newErrors.company_id = 'Company is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.jd_text.trim()) newErrors.jd_text = 'Job description is required';
    
    if (formData.salary_min && formData.salary_max && Number(formData.salary_min) >= Number(formData.salary_max)) {
      newErrors.salary_max = 'Maximum salary must be greater than minimum salary';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const jobData = {
        ...formData,
        salary_min: formData.salary_min === '' ? null : Number(formData.salary_min),
        salary_max: formData.salary_max === '' ? null : Number(formData.salary_max),
        requirements: formData.requirements.filter(req => req.trim() !== ''),
        nice_to_haves: formData.nice_to_haves.filter(nth => nth.trim() !== '')
      };

      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData)
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/jobs/${jobId}`);
        }, 2000);
      } else {
        const data = await response.json();
        setErrors({ submit: data.error || 'Failed to update job' });
      }
    } catch (error) {
      setErrors({ submit: 'Failed to update job' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/jobs');
      } else {
        const data = await response.json();
        setErrors({ delete: data.error || 'Failed to delete job' });
      }
    } catch (error) {
      setErrors({ delete: 'Failed to delete job' });
    } finally {
      setIsDeleting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  if (errors.fetch) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">{errors.fetch}</p>
          <button
            onClick={() => router.push('/jobs')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckIcon className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Job Updated Successfully!</h2>
          <p className="text-gray-600 mb-4">Your changes have been saved and you'll be redirected to view the job shortly.</p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <BriefcaseIcon className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Edit Job</h1>
                <p className="text-blue-100">{job?.title}</p>
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
            >
              <TrashIcon className="h-4 w-4" />
              {isDeleting ? 'Deleting...' : 'Delete Job'}
            </button>
          </div>
          <p className="text-blue-100 text-lg">Update job details and requirements</p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-500 mr-2" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g. Senior Frontend Developer"
                  />
                  {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <select
                    value={formData.company_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_id: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.company_id ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                  {errors.company_id && <p className="mt-1 text-sm text-red-600">{errors.company_id}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g. Engineering"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="e.g. San Francisco, CA"
                  />
                  {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location Type
                  </label>
                  <select
                    value={formData.location_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, location_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="on-site">On-site</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={formData.employment_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, employment_type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={formData.experience_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, experience_level: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as 'draft' | 'published' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-green-500 mr-2" />
                Salary Range
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Salary ($)
                  </label>
                  <input
                    type="number"
                    value={formData.salary_min}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_min: e.target.value === '' ? '' : Number(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="80000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Salary ($)
                  </label>
                  <input
                    type="number"
                    value={formData.salary_max}
                    onChange={(e) => setFormData(prev => ({ ...prev, salary_max: e.target.value === '' ? '' : Number(e.target.value) }))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.salary_max ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="120000"
                  />
                  {errors.salary_max && <p className="mt-1 text-sm text-red-600">{errors.salary_max}</p>}
                </div>
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-purple-500 mr-2" />
                  Job Description
                </h2>
                <button
                  type="button"
                  onClick={generateJobDescription}
                  disabled={isGenerating || !formData.title || !formData.company_id}
                  className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <SparklesIcon className="h-4 w-4 mr-2" />
                  {isGenerating ? 'Regenerating...' : 'Regenerate with AI'}
                </button>
              </div>

              {errors.ai_generation && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-700">{errors.ai_generation}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description *
                </label>
                <textarea
                  value={formData.jd_text}
                  onChange={(e) => setFormData(prev => ({ ...prev, jd_text: e.target.value }))}
                  rows={8}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.jd_text ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter job description..."
                />
                {errors.jd_text && <p className="mt-1 text-sm text-red-600">{errors.jd_text}</p>}
              </div>
            </div>

            {/* Requirements & Nice-to-Haves */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Requirements */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayInputChange('requirements', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter requirement"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Requirement
                </button>
              </div>

              {/* Nice-to-Haves */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nice-to-Haves</h3>
                {formData.nice_to_haves.map((nth, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={nth}
                      onChange={(e) => handleArrayInputChange('nice_to_haves', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter nice-to-have"
                    />
                    {formData.nice_to_haves.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('nice_to_haves', index)}
                        className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('nice_to_haves')}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Nice-to-Have
                </button>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              {(errors.submit || errors.delete) && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-red-700">{errors.submit || errors.delete}</span>
                </div>
              )}

              <div className="flex gap-4 justify-end">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}