'use client';

import { useState } from 'react';
import { 
  XMarkIcon, 
  BuildingOfficeIcon, 
  MapPinIcon, 
  UsersIcon,
  GlobeAltIcon,
  ChartBarIcon,
  PencilIcon,
  CheckIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

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
  deal?: any;
};

interface CompanyDetailsModalProps {
  company: Company;
  onClose: () => void;
  onUpdate: (updatedCompany: Company) => void;
  onAddToPipeline?: () => void;
  onViewDeal?: () => void;
}

export function CompanyDetailsModal({ 
  company, 
  onClose, 
  onUpdate,
  onAddToPipeline,
  onViewDeal
}: CompanyDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: company.name,
    domain: company.domain || '',
    industry: company.industry || '',
    size: company.size || '',
    location: company.location || '',
    partner_status: company.partner_status,
    hiring_urgency: company.hiring_urgency || '',
    hiring_volume: company.hiring_volume?.toString() || '',
    growth_stage: company.growth_stage || ''
  });

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/companies/${company.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) {
        throw new Error('Failed to update company');
      }

      const updatedCompany = {
        ...company,
        ...editForm,
        hiring_volume: editForm.hiring_volume ? parseInt(editForm.hiring_volume) : undefined
      };

      onUpdate(updatedCompany);
      setIsEditing(false);
      alert('Company updated successfully!');
    } catch (error) {
      console.error('Error updating company:', error);
      alert('Failed to update company. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-blue-100 text-blue-800';
      case 'prospect': return 'bg-green-100 text-green-800';
      case 'active': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                <BuildingOfficeIcon className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Company Details</h2>
                <p className="text-sm text-gray-500">View and edit company information</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Details
                </button>
                {!company.deal && (
                  <button
                    onClick={onAddToPipeline}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    Add to Pipeline
                  </button>
                )}
                {company.deal && (
                  <button
                    onClick={onViewDeal}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <ChartBarIcon className="h-4 w-4" />
                    View Deal
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                  <CheckIcon className="h-4 w-4" />
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({
                      name: company.name,
                      domain: company.domain || '',
                      industry: company.industry || '',
                      size: company.size || '',
                      location: company.location || '',
                      partner_status: company.partner_status,
                      hiring_urgency: company.hiring_urgency || '',
                      hiring_volume: company.hiring_volume?.toString() || '',
                      growth_stage: company.growth_stage || ''
                    });
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 flex items-center gap-2"
                >
                  <XCircleIcon className="h-4 w-4" />
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Company Information Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                ) : (
                  <p className="mt-1 text-lg font-semibold text-gray-900">{company.name}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.domain}
                    onChange={(e) => setEditForm({ ...editForm, domain: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="example.com"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-1">
                    <GlobeAltIcon className="h-4 w-4 text-gray-400" />
                    {company.domain || 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</label>
                {isEditing ? (
                  <select
                    value={editForm.industry}
                    onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select industry</option>
                    <option value="Technology">Technology</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Finance">Finance</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Biotech">Biotech</option>
                    <option value="Manufacturing">Manufacturing</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900">{company.industry || 'Not specified'}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    placeholder="City, State"
                  />
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4 text-gray-400" />
                    {company.location || 'Not specified'}
                  </p>
                )}
              </div>
            </div>

            {/* Status & Metrics */}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Partner Status</label>
                {isEditing ? (
                  <select
                    value={editForm.partner_status}
                    onChange={(e) => setEditForm({ ...editForm, partner_status: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="active">Active Partner</option>
                    <option value="inactive">Inactive</option>
                  </select>
                ) : (
                  <div className="mt-1">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(company.partner_status)}`}>
                      {company.partner_status}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Company Size</label>
                {isEditing ? (
                  <select
                    value={editForm.size}
                    onChange={(e) => setEditForm({ ...editForm, size: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-200">51-200</option>
                    <option value="201-500">201-500</option>
                    <option value="501-1000">501-1000</option>
                    <option value="1000+">1000+</option>
                  </select>
                ) : (
                  <p className="mt-1 text-gray-900 flex items-center gap-1">
                    <UsersIcon className="h-4 w-4 text-gray-400" />
                    {company.size ? `${company.size} employees` : 'Not specified'}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Hiring Urgency</label>
                {isEditing ? (
                  <select
                    value={editForm.hiring_urgency}
                    onChange={(e) => setEditForm({ ...editForm, hiring_urgency: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select urgency</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                ) : (
                  <div className="mt-1">
                    {company.hiring_urgency ? (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(company.hiring_urgency)}`}>
                        {company.hiring_urgency} urgency
                      </span>
                    ) : (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Growth Stage</label>
                {isEditing ? (
                  <select
                    value={editForm.growth_stage}
                    onChange={(e) => setEditForm({ ...editForm, growth_stage: e.target.value })}
                    className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Select stage</option>
                    <option value="seed">Seed</option>
                    <option value="series-a">Series A</option>
                    <option value="series-b">Series B</option>
                    <option value="growth">Growth</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                ) : (
                  <div className="mt-1">
                    {company.growth_stage ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                        {company.growth_stage}
                      </span>
                    ) : (
                      <span className="text-gray-500">Not specified</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Metrics Section */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Metrics & Activity</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{company.active_jobs_count || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase">Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{company.contacts_count || 0}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500 uppercase">Hiring Volume</p>
                {isEditing ? (
                  <input
                    type="number"
                    value={editForm.hiring_volume}
                    onChange={(e) => setEditForm({ ...editForm, hiring_volume: e.target.value })}
                    className="mt-1 w-full px-2 py-1 border border-gray-300 rounded text-lg font-bold"
                    placeholder="0"
                  />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{company.hiring_volume || 0}</p>
                )}
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          {company.signals?.tech_stack && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Tech Stack</h3>
              <div className="flex flex-wrap gap-2">
                {company.signals.tech_stack.map((tech: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Deal Information */}
          {company.deal && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Pipeline Status</h3>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Stage</p>
                    <p className="font-semibold text-gray-900">{company.deal.stage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Value</p>
                    <p className="font-semibold text-gray-900">${company.deal.value?.toLocaleString() || 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Probability</p>
                    <p className="font-semibold text-gray-900">{company.deal.probability || 0}%</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}