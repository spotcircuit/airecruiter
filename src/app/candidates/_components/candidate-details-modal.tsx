'use client';

import { useState } from 'react';
import { 
  XMarkIcon, 
  UserIcon,
  MapPinIcon,
  EnvelopeIcon,
  PhoneIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  LinkIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckIcon,
  TagIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

type Candidate = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  location?: string;
  current_title?: string;
  current_company?: string;
  years_experience?: number;
  skills?: string[];
  education?: any;
  experience?: any;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  willing_to_relocate?: boolean;
  salary_expectations_min?: number;
  salary_expectations_max?: number;
  notice_period_weeks?: number;
  source?: string;
  tags?: string[];
  notes?: string;
  created_at?: string;
  updated_at?: string;
};

interface CandidateDetailsModalProps {
  candidate: Candidate;
  onClose: () => void;
  onUpdate: (updatedCandidate: Candidate) => void;
  onAddToProject?: (projectId: string) => void;
  onStartOutreach?: () => void;
}

export function CandidateDetailsModal({ 
  candidate, 
  onClose, 
  onUpdate,
  onAddToProject,
  onStartOutreach
}: CandidateDetailsModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'skills' | 'notes'>('overview');
  const [editForm, setEditForm] = useState({
    first_name: candidate.first_name,
    last_name: candidate.last_name,
    email: candidate.email,
    phone: candidate.phone || '',
    location: candidate.location || '',
    current_title: candidate.current_title || '',
    current_company: candidate.current_company || '',
    years_experience: candidate.years_experience?.toString() || '',
    willing_to_relocate: candidate.willing_to_relocate || false,
    salary_expectations_min: candidate.salary_expectations_min?.toString() || '',
    salary_expectations_max: candidate.salary_expectations_max?.toString() || '',
    notice_period_weeks: candidate.notice_period_weeks?.toString() || '',
    notes: candidate.notes || ''
  });

  const [newTag, setNewTag] = useState('');
  const [tags, setTags] = useState<string[]>(candidate.tags || []);

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/candidates/${candidate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          years_experience: editForm.years_experience ? parseInt(editForm.years_experience) : null,
          salary_expectations_min: editForm.salary_expectations_min ? parseInt(editForm.salary_expectations_min) : null,
          salary_expectations_max: editForm.salary_expectations_max ? parseInt(editForm.salary_expectations_max) : null,
          notice_period_weeks: editForm.notice_period_weeks ? parseInt(editForm.notice_period_weeks) : null,
          tags
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update candidate');
      }

      const updatedCandidate = await response.json();
      onUpdate(updatedCandidate);
      setIsEditing(false);
      alert('Candidate updated successfully!');
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('Failed to update candidate. Please try again.');
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    if (min) return `$${min.toLocaleString()}+`;
    if (max) return `Up to $${max.toLocaleString()}`;
    return 'Not specified';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center">
                <UserIcon className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {candidate.first_name} {candidate.last_name}
                </h2>
                <p className="text-sm text-gray-600">
                  {candidate.current_title || 'Candidate'} {candidate.current_company && `at ${candidate.current_company}`}
                </p>
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

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {(['overview', 'experience', 'skills', 'notes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Action Buttons */}
          <div className="flex gap-2 mb-4">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <PencilIcon className="h-4 w-4" />
                  Edit Profile
                </button>
                {onAddToProject && (
                  <button
                    onClick={onAddToProject}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                  >
                    <BriefcaseIcon className="h-4 w-4" />
                    Add to Project
                  </button>
                )}
                {onStartOutreach && (
                  <button
                    onClick={onStartOutreach}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                  >
                    <EnvelopeIcon className="h-4 w-4" />
                    Start Outreach
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
                      first_name: candidate.first_name,
                      last_name: candidate.last_name,
                      email: candidate.email,
                      phone: candidate.phone || '',
                      location: candidate.location || '',
                      current_title: candidate.current_title || '',
                      current_company: candidate.current_company || '',
                      years_experience: candidate.years_experience?.toString() || '',
                      willing_to_relocate: candidate.willing_to_relocate || false,
                      salary_expectations_min: candidate.salary_expectations_min?.toString() || '',
                      salary_expectations_max: candidate.salary_expectations_max?.toString() || '',
                      notice_period_weeks: candidate.notice_period_weeks?.toString() || '',
                      notes: candidate.notes || ''
                    });
                    setTags(candidate.tags || []);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Contact Information</h3>
                
                <div>
                  <label className="text-xs text-gray-500">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <EnvelopeIcon className="h-4 w-4 text-gray-400" />
                      {candidate.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="(555) 123-4567"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <PhoneIcon className="h-4 w-4 text-gray-400" />
                      {candidate.phone || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500">Location</label>
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
                      {candidate.location || 'Not specified'}
                    </p>
                  )}
                </div>

                {/* Links */}
                <div className="space-y-2">
                  {candidate.linkedin_url && (
                    <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" 
                       className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <LinkIcon className="h-4 w-4" />
                      LinkedIn Profile
                    </a>
                  )}
                  {candidate.github_url && (
                    <a href={candidate.github_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <LinkIcon className="h-4 w-4" />
                      GitHub Profile
                    </a>
                  )}
                  {candidate.resume_url && (
                    <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                      <DocumentTextIcon className="h-4 w-4" />
                      View Resume
                    </a>
                  )}
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Professional Details</h3>
                
                <div>
                  <label className="text-xs text-gray-500">Current Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.current_title}
                      onChange={(e) => setEditForm({ ...editForm, current_title: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Software Engineer"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <BriefcaseIcon className="h-4 w-4 text-gray-400" />
                      {candidate.current_title || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500">Current Company</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.current_company}
                      onChange={(e) => setEditForm({ ...editForm, current_company: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tech Corp"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <BuildingOfficeIcon className="h-4 w-4 text-gray-400" />
                      {candidate.current_company || 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500">Years of Experience</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.years_experience}
                      onChange={(e) => setEditForm({ ...editForm, years_experience: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4 text-gray-400" />
                      {candidate.years_experience ? `${candidate.years_experience} years` : 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500">Salary Expectations</label>
                  {isEditing ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="number"
                        value={editForm.salary_expectations_min}
                        onChange={(e) => setEditForm({ ...editForm, salary_expectations_min: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Min"
                      />
                      <input
                        type="number"
                        value={editForm.salary_expectations_max}
                        onChange={(e) => setEditForm({ ...editForm, salary_expectations_max: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Max"
                      />
                    </div>
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                      {formatSalary(candidate.salary_expectations_min, candidate.salary_expectations_max)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500">Notice Period</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editForm.notice_period_weeks}
                      onChange={(e) => setEditForm({ ...editForm, notice_period_weeks: e.target.value })}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900 flex items-center gap-1">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      {candidate.notice_period_weeks ? `${candidate.notice_period_weeks} weeks` : 'Not specified'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs text-gray-500">Willing to Relocate</label>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={editForm.willing_to_relocate}
                      onChange={(e) => setEditForm({ ...editForm, willing_to_relocate: e.target.checked })}
                      className="mt-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {candidate.willing_to_relocate ? 'Yes' : 'No'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experience' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Work Experience</h3>
                {candidate.experience && Array.isArray(candidate.experience) ? (
                  <div className="space-y-4">
                    {candidate.experience.map((exp: any, index: number) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-4">
                        <h4 className="font-medium text-gray-900">{exp.title}</h4>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                        <p className="text-xs text-gray-500">{exp.duration || `${exp.years || 0} years`}</p>
                        {exp.description && (
                          <p className="mt-2 text-sm text-gray-700">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No experience data available</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Education</h3>
                {candidate.education && Array.isArray(candidate.education) ? (
                  <div className="space-y-4">
                    {candidate.education.map((edu: any, index: number) => (
                      <div key={index} className="border-l-2 border-green-200 pl-4">
                        <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">{edu.institution}</p>
                        <p className="text-xs text-gray-500">{edu.field || edu.year}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No education data available</p>
                )}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Skills</h3>
                {candidate.skills && candidate.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {candidate.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No skills listed</p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Tags</h3>
                <div className="space-y-3">
                  {isEditing && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addTag()}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Add a tag..."
                      />
                      <button
                        onClick={addTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Add
                      </button>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                        <TagIcon className="h-3 w-3" />
                        {tag}
                        {isEditing && (
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-gray-500 hover:text-red-500"
                          >
                            <XMarkIcon className="h-3 w-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Notes</h3>
              {isEditing ? (
                <textarea
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={10}
                  placeholder="Add notes about this candidate..."
                />
              ) : (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {candidate.notes || 'No notes added yet'}
                  </p>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider mb-3">Metadata</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Source:</span>
                    <span className="ml-2 text-gray-900">{candidate.source || 'Direct'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Added:</span>
                    <span className="ml-2 text-gray-900">
                      {candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">Last Updated:</span>
                    <span className="ml-2 text-gray-900">
                      {candidate.updated_at ? new Date(candidate.updated_at).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-500">ID:</span>
                    <span className="ml-2 text-gray-900">#{candidate.id}</span>
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