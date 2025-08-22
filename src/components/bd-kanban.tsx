'use client';

import { useState, useEffect, useRef } from 'react';
import { DealStage } from '@/types/database';
import { ChevronRightIcon, PlusIcon, BuildingOfficeIcon, CurrencyDollarIcon, CalendarIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Deal {
  id: string;
  company_id: string;
  name: string;
  stage: DealStage;
  value?: number;
  probability?: number;
  next_step?: string;
  company_name?: string;
  company_industry?: string;
  updated_at: string;
}

interface NewDealForm {
  name: string;
  company_name: string;
  company_id: string | null;
  value: string;
  probability: string;
  next_step: string;
}

interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
}

const stages: { key: DealStage; label: string; color: string }[] = [
  { key: 'prospect', label: 'Prospect', color: 'bg-gray-100' },
  { key: 'discovery', label: 'Discovery', color: 'bg-blue-100' },
  { key: 'proposal', label: 'Proposal', color: 'bg-yellow-100' },
  { key: 'won', label: 'Won', color: 'bg-green-100' },
  { key: 'lost', label: 'Lost', color: 'bg-red-100' },
];

export function BDKanban() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);
  const [showNewDealForm, setShowNewDealForm] = useState(false);
  const [newDealForm, setNewDealForm] = useState<NewDealForm>({
    name: '',
    company_name: '',
    company_id: null,
    value: '',
    probability: '20',
    next_step: ''
  });
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<NewDealForm>({
    name: '',
    company_name: '',
    company_id: null,
    value: '',
    probability: '',
    next_step: ''
  });
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companySearch, setCompanySearch] = useState('');
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [editCompanySearch, setEditCompanySearch] = useState('');
  const [showEditCompanyDropdown, setShowEditCompanyDropdown] = useState(false);
  const companyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  useEffect(() => {
    if (companySearch.length > 1) {
      searchCompanies(companySearch);
    } else {
      setCompanies([]);
    }
  }, [companySearch]);

  useEffect(() => {
    if (editCompanySearch.length > 1) {
      searchCompanies(editCompanySearch);
    } else {
      setCompanies([]);
    }
  }, [editCompanySearch]);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      if (!response.ok) {
        throw new Error(`Failed to fetch deals: ${response.status}`);
      }
      const data = await response.json();
      setDeals(data.deals || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDeals([]); // Show empty state instead of mock data
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, newStage: DealStage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (!draggedDeal || draggedDeal.stage === newStage) return;
    
    // Optimistically update UI
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === draggedDeal.id 
          ? { ...deal, stage: newStage }
          : deal
      )
    );
    
    // Update in database
    try {
      await fetch('/api/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draggedDeal.id, stage: newStage })
      });
    } catch (error) {
      console.error('Error updating deal stage:', error);
      // Revert on error
      fetchDeals();
    }
    
    setDraggedDeal(null);
  };

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'TBD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTotalValue = (stage: DealStage) => {
    const stageDeals = getDealsByStage(stage);
    const total = stageDeals.reduce((sum, deal) => {
      const value = typeof deal.value === 'string' ? parseFloat(deal.value) : deal.value;
      return sum + (value || 0);
    }, 0);
    return formatCurrency(total);
  };

  const searchCompanies = async (searchTerm: string) => {
    try {
      const response = await fetch(`/api/companies/search?q=${encodeURIComponent(searchTerm)}`);
      if (response.ok) {
        const data = await response.json();
        setCompanies(data.companies || []);
        setShowCompanyDropdown(true);
      }
    } catch (error) {
      console.error('Error searching companies:', error);
    }
  };

  const handleCreateDeal = async () => {
    try {
      // Only allow creating deals with existing companies
      if (!newDealForm.company_id) {
        alert('Please select an existing company from the dropdown');
        return;
      }

      const dealData = {
        name: newDealForm.name,
        company_id: newDealForm.company_id,
        stage: 'prospect' as DealStage,
        value: newDealForm.value ? parseFloat(newDealForm.value) : null,
        probability: newDealForm.probability ? parseInt(newDealForm.probability) : null,
        next_step: newDealForm.next_step || null
      };

      const response = await fetch('/api/deals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dealData)
      });

      if (!response.ok) {
        throw new Error('Failed to create deal');
      }

      const newDeal = await response.json();
      
      // Add company_name from form to the new deal for display
      newDeal.company_name = newDealForm.company_name;
      
      setDeals(prevDeals => [...prevDeals, newDeal]);
      setShowNewDealForm(false);
      setNewDealForm({
        name: '',
        company_name: '',
        company_id: null,
        value: '',
        probability: '20',
        next_step: ''
      });
      setCompanySearch('');
    } catch (error) {
      console.error('Error creating deal:', error);
      alert('Failed to create deal. Please try again.');
    }
  };

  const handleSelectCompany = (company: Company) => {
    setNewDealForm({
      ...newDealForm,
      company_name: company.name,
      company_id: company.id
    });
    setCompanySearch(company.name);
    setShowCompanyDropdown(false);
  };

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setEditForm({
      name: deal.name,
      company_name: deal.company_name || '',
      company_id: deal.company_id,
      value: deal.value?.toString() || '',
      probability: deal.probability?.toString() || '',
      next_step: deal.next_step || ''
    });
    setEditCompanySearch(deal.company_name || '');
    setEditMode(false);
  };

  const handleSelectEditCompany = (company: Company) => {
    setEditForm({
      ...editForm,
      company_name: company.name,
      company_id: company.id
    });
    setEditCompanySearch(company.name);
    setShowEditCompanyDropdown(false);
  };

  const handleUpdateDeal = async () => {
    if (!selectedDeal) return;

    // Require a company to be selected
    if (!editForm.company_id) {
      alert('Please select a company from the dropdown');
      return;
    }

    try {
      const updates = {
        id: selectedDeal.id,
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
      setDeals(prevDeals =>
        prevDeals.map(deal =>
          deal.id === selectedDeal.id
            ? { 
                ...deal, 
                name: editForm.name,
                company_name: editForm.company_name,
                company_id: editForm.company_id,
                value: updates.value,
                probability: updates.probability,
                next_step: updates.next_step
              }
            : deal
        )
      );

      setEditMode(false);
      setSelectedDeal(null);
      setEditCompanySearch('');
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

      setDeals(prevDeals => prevDeals.filter(deal => deal.id !== selectedDeal.id));
      setSelectedDeal(null);
    } catch (error) {
      console.error('Error deleting deal:', error);
      alert('Failed to delete deal. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No deals in pipeline</h3>
        <p className="text-gray-600 mb-4">Add companies to your pipeline from the Discover tab</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex gap-4 w-full">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.key);
          const isDropTarget = dragOverStage === stage.key;
          
          return (
            <div
              key={stage.key}
              className={`flex-1 min-w-0 bg-gray-50 rounded-lg p-4 ${
                isDropTarget ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Total: {getTotalValue(stage.key)}
                </div>
              </div>
              
              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    onClick={() => handleDealClick(deal)}
                    className={`${stage.color} p-4 rounded-lg cursor-pointer hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {deal.name}
                      </h4>
                      {deal.probability !== undefined && deal.probability !== null && (
                        <span className="text-xs bg-white px-2 py-1 rounded">
                          {deal.probability}%
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                        <span className="truncate">{deal.company_name || 'Unknown'}</span>
                      </div>
                      
                      {deal.value && (
                        <div className="flex items-center text-xs text-gray-600">
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          <span>{formatCurrency(deal.value)}</span>
                        </div>
                      )}
                      
                      {deal.next_step && (
                        <div className="flex items-start text-xs text-gray-600 mt-2">
                          <ChevronRightIcon className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{deal.next_step}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>{new Date(deal.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {stage.key === 'prospect' && (
                  <button 
                    onClick={() => {
                      setShowNewDealForm(true);
                      setCompanySearch('');
                      setNewDealForm({
                        name: '',
                        company_name: '',
                        company_id: null,
                        value: '',
                        probability: '20',
                        next_step: ''
                      });
                    }}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Deal
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Deal Details/Edit Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {editMode ? 'Edit Deal' : 'Deal Details'}
              </h3>
              <button
                onClick={() => {
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
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{selectedDeal.name}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company
                </label>
                {editMode ? (
                  <input
                    type="text"
                    value={editForm.company_name}
                    onChange={(e) => setEditForm({ ...editForm, company_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <p className="text-gray-900">{selectedDeal.company_name || 'Not specified'}</p>
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
                    />
                  ) : (
                    <p className="text-gray-900">{formatCurrency(selectedDeal.value)}</p>
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
                    />
                  ) : (
                    <p className="text-gray-900">{selectedDeal.probability ? `${selectedDeal.probability}%` : 'Not set'}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage
                </label>
                <p className="text-gray-900 capitalize">{selectedDeal.stage}</p>
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
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Deal
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* New Deal Modal */}
      {showNewDealForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Deal</h3>
              <button
                onClick={() => setShowNewDealForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deal Name *
                </label>
                <input
                  type="text"
                  value={newDealForm.name}
                  onChange={(e) => setNewDealForm({ ...newDealForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Partnership with Acme Corp"
                />
              </div>
              
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  ref={companyInputRef}
                  type="text"
                  value={companySearch}
                  onChange={(e) => {
                    setCompanySearch(e.target.value);
                    setNewDealForm({ ...newDealForm, company_name: e.target.value, company_id: null });
                  }}
                  onFocus={() => companySearch.length > 1 && setShowCompanyDropdown(true)}
                  onBlur={() => setTimeout(() => setShowCompanyDropdown(false), 200)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Acme Corporation"
                />
                
                {showCompanyDropdown && companies.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
                    {companies.map((company) => (
                      <button
                        key={company.id}
                        type="button"
                        onClick={() => handleSelectCompany(company)}
                        className="w-full text-left px-3 py-2 hover:bg-gray-100 transition-colors"
                      >
                        <div className="font-medium text-gray-900">{company.name}</div>
                        {company.industry && (
                          <div className="text-sm text-gray-600">{company.industry}</div>
                        )}
                      </button>
                    ))}
                  </div>
                )}
                
                {companySearch.length > 1 && companies.length === 0 && showCompanyDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg p-3">
                    <p className="text-sm text-gray-600">
                      No companies found. A new company "{companySearch}" will be created.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Value ($)
                  </label>
                  <input
                    type="number"
                    value={newDealForm.value}
                    onChange={(e) => setNewDealForm({ ...newDealForm, value: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="50000"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Probability (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newDealForm.probability}
                    onChange={(e) => setNewDealForm({ ...newDealForm, probability: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Next Step
                </label>
                <textarea
                  value={newDealForm.next_step}
                  onChange={(e) => setNewDealForm({ ...newDealForm, next_step: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                  placeholder="e.g., Schedule intro call with decision maker"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowNewDealForm(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateDeal}
                disabled={!newDealForm.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}