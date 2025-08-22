'use client';

import { useEffect, useState } from 'react';
import { BuildingOfficeIcon, MapPinIcon, UsersIcon, ArrowPathIcon, PlusCircleIcon, ChartBarIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DealStage } from '@/types/database';
import { CompanyDetailsModal } from './company-details-modal';

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
  deal?: Deal;
};

type Deal = {
  id: string;
  company_id: string;
  name: string;
  stage: DealStage;
  value?: number;
  probability?: number;
  next_step?: string;
  updated_at: string;
};

export function CompanyListDB() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [showDealModal, setShowDealModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    value: '',
    probability: '',
    next_step: '',
    stage: '' as DealStage
  });

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      
      // Fetch companies
      const companiesResponse = await fetch('/api/companies');
      const companiesData = await companiesResponse.json();
      
      if (companiesData.error) {
        throw new Error(companiesData.error);
      }
      
      // Fetch deals
      const dealsResponse = await fetch('/api/deals');
      const dealsData = await dealsResponse.json();
      
      // Map deals to companies
      const companiesWithDeals = (companiesData.companies || []).map((company: Company) => {
        const deal = dealsData.deals?.find((d: Deal) => d.company_id === company.id);
        return { ...company, deal };
      });
      
      setCompanies(companiesWithDeals);
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
        const newDeal = await response.json();
        // Update the company with its new deal locally
        setCompanies(prev => prev.map(c => 
          c.id === companyId ? { ...c, deal: newDeal, partner_status: 'prospect' } : c
        ));
        // Show success message
        alert(`Added ${companyName} to BD pipeline!`);
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

  const getStageColor = (stage: DealStage) => {
    switch (stage) {
      case 'prospect': return 'bg-gray-100 text-gray-800';
      case 'discovery': return 'bg-blue-100 text-blue-800';
      case 'proposal': return 'bg-yellow-100 text-yellow-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const viewDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setEditForm({
      value: deal.value?.toString() || '',
      probability: deal.probability?.toString() || '',
      next_step: deal.next_step || '',
      stage: deal.stage
    });
    setEditMode(false);
    setShowDealModal(true);
  };

  const handleUpdateDeal = async () => {
    if (!selectedDeal) return;

    try {
      const updates = {
        id: selectedDeal.id,
        stage: editForm.stage,
        value: editForm.value ? parseFloat(editForm.value) : null,
        probability: editForm.probability ? parseInt(editForm.probability) : null,
        next_step: editForm.next_step || null
      };

      const response = await fetch('/api/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        throw new Error('Failed to update deal');
      }

      // Update local state
      const updatedDeal = { ...selectedDeal, ...updates };
      setCompanies(prev => prev.map(c => 
        c.deal?.id === selectedDeal.id ? { ...c, deal: updatedDeal } : c
      ));
      
      setSelectedDeal(updatedDeal);
      setEditMode(false);
      alert('Deal updated successfully!');
    } catch (error) {
      console.error('Error updating deal:', error);
      alert('Failed to update deal. Please try again.');
    }
  };

  const handleDeleteDeal = async () => {
    if (!selectedDeal || !confirm('Are you sure you want to delete this deal?')) return;

    try {
      const response = await fetch(`/api/deals/${selectedDeal.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete deal');
      }

      // Update local state
      setCompanies(prev => prev.map(c => 
        c.deal?.id === selectedDeal.id ? { ...c, deal: undefined } : c
      ));
      
      setShowDealModal(false);
      setSelectedDeal(null);
      alert('Deal deleted successfully!');
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Failed to delete deal. Please try again.');
    }
  };

  const goToPipeline = () => {
    window.location.href = '/companies?view=pipeline';
  };

  const handleCompanyUpdate = (updatedCompany: Company) => {
    setCompanies(prev => prev.map(c => 
      c.id === updatedCompany.id ? updatedCompany : c
    ));
    setSelectedCompany(updatedCompany);
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
            <li key={company.id} className="hover:bg-blue-50 group transition-colors duration-150 cursor-pointer" onClick={() => {
              setSelectedCompany(company);
              setShowCompanyModal(true);
            }}>
              <div className="px-6 py-4">
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

                  <div className="ml-4 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                    {company.deal ? (
                      <button
                        onClick={() => viewDeal(company.deal!)}
                        className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-md ${getStageColor(company.deal.stage)} border border-current hover:opacity-80 transition-opacity`}
                      >
                        <ChartBarIcon className="h-4 w-4 mr-1" />
                        {company.deal.stage.charAt(0).toUpperCase() + company.deal.stage.slice(1)}
                      </button>
                    ) : (
                      <button
                        onClick={() => addToPipeline(company.id, company.name)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <PlusCircleIcon className="h-4 w-4 mr-1" />
                        Add to Pipeline
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Deal Modal */}
      {showDealModal && selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editMode ? 'Edit Deal' : 'Deal Details'}
              </h3>
              <button
                onClick={() => {
                  setShowDealModal(false);
                  setSelectedDeal(null);
                  setEditMode(false);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Name
                </label>
                <p className="text-gray-900">{selectedDeal.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                {editMode ? (
                  <select
                    value={editForm.stage}
                    onChange={(e) => setEditForm({ ...editForm, stage: e.target.value as DealStage })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="prospect">Prospect</option>
                    <option value="discovery">Discovery</option>
                    <option value="proposal">Proposal</option>
                    <option value="won">Won</option>
                    <option value="lost">Lost</option>
                  </select>
                ) : (
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(selectedDeal.stage)}`}>
                    {selectedDeal.stage.charAt(0).toUpperCase() + selectedDeal.stage.slice(1)}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      value={editForm.value}
                      onChange={(e) => setEditForm({ ...editForm, value: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="50000"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {selectedDeal.value 
                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(selectedDeal.value)
                        : 'TBD'}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probability
                  </label>
                  {editMode ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={editForm.probability}
                      onChange={(e) => setEditForm({ ...editForm, probability: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="30"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {selectedDeal.probability ? `${selectedDeal.probability}%` : 'Not set'}
                    </p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Step
                </label>
                {editMode ? (
                  <textarea
                    value={editForm.next_step}
                    onChange={(e) => setEditForm({ ...editForm, next_step: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                    placeholder="e.g., Schedule intro call with decision maker"
                  />
                ) : (
                  <p className="text-gray-900">{selectedDeal.next_step || 'Not specified'}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Updated
                </label>
                <p className="text-gray-600">{new Date(selectedDeal.updated_at).toLocaleString()}</p>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <button
                onClick={handleDeleteDeal}
                className="px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
              >
                Delete Deal
              </button>
              
              <div className="flex gap-3">
                {editMode ? (
                  <>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateDeal}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Edit Deal
                    </button>
                    <button
                      onClick={goToPipeline}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Go to Pipeline
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Company Details Modal */}
      {showCompanyModal && selectedCompany && (
        <CompanyDetailsModal
          company={selectedCompany}
          onClose={() => {
            setShowCompanyModal(false);
            setSelectedCompany(null);
          }}
          onUpdate={handleCompanyUpdate}
          onAddToPipeline={() => {
            addToPipeline(selectedCompany.id, selectedCompany.name);
            setShowCompanyModal(false);
          }}
          onViewDeal={() => {
            if (selectedCompany.deal) {
              setSelectedDeal(selectedCompany.deal);
              setShowDealModal(true);
              setShowCompanyModal(false);
              setEditMode(false);
              setEditForm({
                value: selectedCompany.deal.value?.toString() || '',
                probability: selectedCompany.deal.probability?.toString() || '',
                next_step: selectedCompany.deal.next_step || '',
                stage: selectedCompany.deal.stage
              });
            }
          }}
        />
      )}
    </div>
  );
}