'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  BriefcaseIcon,
  UserGroupIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  LinkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { Company, Job, Contact, Deal } from '@/types/database';

interface CompanyDetailsData {
  company: Company;
  jobs: Job[];
  contacts: Contact[];
  deals: Deal[];
}

export default function CompanyDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const companyId = params.id as string;
  
  const [data, setData] = useState<CompanyDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchCompanyDetails();
  }, [companyId]);

  const fetchCompanyDetails = async () => {
    try {
      const response = await fetch(`/api/companies/${companyId}`);
      if (!response.ok) {
        throw new Error('Company not found');
      }
      const companyData = await response.json();
      setData(companyData);
    } catch (err) {
      setError('Failed to load company details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this company? This will also delete all related jobs, contacts, and deals. This action cannot be undone.')) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/companies/${companyId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.push('/companies');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete company');
      }
    } catch (error) {
      alert('Failed to delete company');
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'lead': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'churned': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDealStageColor = (stage: string) => {
    switch (stage) {
      case 'won': return 'bg-green-100 text-green-800';
      case 'proposal': return 'bg-blue-100 text-blue-800';
      case 'discovery': return 'bg-yellow-100 text-yellow-800';
      case 'prospect': return 'bg-purple-100 text-purple-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Not specified';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading company details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.push('/companies')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  const { company, jobs, contacts, deals } = data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-blue-100 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>
          </div>
          
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                <BuildingOfficeIcon className="h-10 w-10" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{company.name}</h1>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(company.partner_status)}`}>
                    {company.partner_status}
                  </span>
                </div>
                {company.industry && (
                  <p className="text-blue-100 text-lg mb-2">{company.industry}</p>
                )}
                <div className="flex items-center gap-6 text-blue-100">
                  {company.location && (
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      {company.location}
                    </div>
                  )}
                  {company.size && (
                    <div className="flex items-center gap-1">
                      <UsersIcon className="h-4 w-4" />
                      {company.size} employees
                    </div>
                  )}
                  {company.website_url && (
                    <a
                      href={company.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 hover:text-white transition-colors"
                    >
                      <GlobeAltIcon className="h-4 w-4" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => router.push(`/companies/${companyId}/edit`)}
                className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all"
              >
                <PencilIcon className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Company Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 text-blue-500 mr-2" />
                Company Details
              </h2>
              
              <div className="space-y-4">
                {company.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900">{company.description}</p>
                  </div>
                )}
                
                {company.domain && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain</label>
                    <p className="text-gray-900">{company.domain}</p>
                  </div>
                )}
                
                {company.headquarters && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Headquarters</label>
                    <p className="text-gray-900">{company.headquarters}</p>
                  </div>
                )}
                
                {company.growth_stage && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Growth Stage</label>
                    <p className="text-gray-900">{company.growth_stage}</p>
                  </div>
                )}
                
                {company.funding_amount && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Funding</label>
                    <p className="text-gray-900">${company.funding_amount.toLocaleString()}</p>
                  </div>
                )}
                
                {company.hiring_urgency && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hiring Urgency</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      company.hiring_urgency === 'high' ? 'bg-red-100 text-red-800' :
                      company.hiring_urgency === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {company.hiring_urgency}
                    </span>
                  </div>
                )}
                
                {company.hiring_volume && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Annual Hiring Volume</label>
                    <p className="text-gray-900">{company.hiring_volume} hires/year</p>
                  </div>
                )}
                
                {company.linkedin_url && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                    <a
                      href={company.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <LinkIcon className="h-4 w-4" />
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ChartBarIcon className="h-5 w-5 text-green-500 mr-2" />
                Quick Stats
              </h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{jobs.length}</div>
                  <div className="text-sm text-gray-600">Active Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{contacts.length}</div>
                  <div className="text-sm text-gray-600">Contacts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{deals.length}</div>
                  <div className="text-sm text-gray-600">Deals</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {deals.filter(d => d.stage === 'won').length}
                  </div>
                  <div className="text-sm text-gray-600">Won Deals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Jobs, Contacts, Deals */}
          <div className="lg:col-span-2 space-y-8">
            {/* Jobs Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <BriefcaseIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Jobs ({jobs.length})
                </h2>
                <button
                  onClick={() => router.push(`/jobs/new?company_id=${companyId}`)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Job
                </button>
              </div>
              
              {jobs.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No jobs posted yet</p>
              ) : (
                <div className="space-y-4">
                  {jobs.map(job => (
                    <div
                      key={job.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/jobs/${job.id}`)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{job.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getJobStatusColor(job.status)}`}>
                              {job.status}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPinIcon className="h-3 w-3" />
                                {job.location}
                              </div>
                            )}
                            <div>{formatSalary(job.salary_min || undefined, job.salary_max || undefined)}</div>
                            {job.experience_level && <div>Experience: {job.experience_level}</div>}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/jobs/${job.id}/edit`);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Contacts Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-green-500 mr-2" />
                  Contacts ({contacts.length})
                </h2>
                <button
                  onClick={() => router.push(`/contacts/new?company_id=${companyId}`)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Contact
                </button>
              </div>
              
              {contacts.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No contacts added yet</p>
              ) : (
                <div className="space-y-4">
                  {contacts.map(contact => (
                    <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {contact.first_name} {contact.last_name}
                            </h3>
                            {contact.is_primary && (
                              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                Primary
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {contact.title && <div>{contact.title}</div>}
                            <div>{contact.email}</div>
                            {contact.phone && <div>{contact.phone}</div>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <a
                            href={`mailto:${contact.email}`}
                            className="text-blue-600 hover:text-blue-800 text-sm"
                          >
                            Email
                          </a>
                          {contact.linkedin_url && (
                            <a
                              href={contact.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Deals Section */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-purple-500 mr-2" />
                  Deals ({deals.length})
                </h2>
                <button
                  onClick={() => router.push(`/deals/new?company_id=${companyId}`)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm"
                >
                  <PlusIcon className="h-4 w-4" />
                  Add Deal
                </button>
              </div>
              
              {deals.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No deals created yet</p>
              ) : (
                <div className="space-y-4">
                  {deals.map(deal => (
                    <div key={deal.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">{deal.name}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getDealStageColor(deal.stage)}`}>
                              {deal.stage}
                            </span>
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            {deal.value && (
                              <div className="flex items-center gap-1">
                                <CurrencyDollarIcon className="h-3 w-3" />
                                ${deal.value.toLocaleString()}
                              </div>
                            )}
                            {deal.probability && <div>Probability: {deal.probability}%</div>}
                            {deal.next_step && <div>Next: {deal.next_step}</div>}
                            {deal.close_date && (
                              <div>Expected close: {new Date(deal.close_date).toLocaleDateString()}</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}