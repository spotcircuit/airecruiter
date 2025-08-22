'use client';

import { useState } from 'react';
import { 
  UserGroupIcon,
  SparklesIcon,
  XMarkIcon,
  PlusIcon,
  CheckIcon,
  TrashIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface CandidateICP {
  id?: string;
  name: string;
  description: string;
  title_keywords: string[];
  required_skills: string[];
  preferred_skills: string[];
  min_experience: number;
  max_experience: number;
  education_requirements: {
    level: string;
    fields: string[];
  };
  location_preferences: {
    cities: string[];
    remote_acceptable: boolean;
    relocation_required: boolean;
  };
  company_preferences: {
    industries: string[];
    company_sizes: string[];
    company_names: string[];
  };
  salary_range: {
    min: number;
    max: number;
    currency: string;
  };
  culture_fit: string[];
  certifications: string[];
  languages: string[];
  availability: {
    notice_period_max_weeks: number;
    immediate_only: boolean;
  };
}

interface CandidateICPBuilderProps {
  onSave: (icp: CandidateICP) => void;
  onCancel?: () => void;
  initialValues?: Partial<CandidateICP>;
  savedICPs?: CandidateICP[];
}

export function CandidateICPBuilder({ 
  onSave, 
  onCancel, 
  initialValues,
  savedICPs = []
}: CandidateICPBuilderProps) {
  const [icp, setICP] = useState<CandidateICP>({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    title_keywords: initialValues?.title_keywords || [],
    required_skills: initialValues?.required_skills || [],
    preferred_skills: initialValues?.preferred_skills || [],
    min_experience: initialValues?.min_experience || 0,
    max_experience: initialValues?.max_experience || 20,
    education_requirements: initialValues?.education_requirements || {
      level: 'bachelor',
      fields: []
    },
    location_preferences: initialValues?.location_preferences || {
      cities: [],
      remote_acceptable: true,
      relocation_required: false
    },
    company_preferences: initialValues?.company_preferences || {
      industries: [],
      company_sizes: [],
      company_names: []
    },
    salary_range: initialValues?.salary_range || {
      min: 0,
      max: 0,
      currency: 'USD'
    },
    culture_fit: initialValues?.culture_fit || [],
    certifications: initialValues?.certifications || [],
    languages: initialValues?.languages || [],
    availability: initialValues?.availability || {
      notice_period_max_weeks: 4,
      immediate_only: false
    }
  });

  // Input states for array fields
  const [titleInput, setTitleInput] = useState('');
  const [requiredSkillInput, setRequiredSkillInput] = useState('');
  const [preferredSkillInput, setPreferredSkillInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  const [industryInput, setIndustryInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [certificationInput, setCertificationInput] = useState('');
  const [languageInput, setLanguageInput] = useState('');
  const [cultureInput, setCultureInput] = useState('');
  const [educationFieldInput, setEducationFieldInput] = useState('');

  // Array management functions
  const addToArray = (array: string[], item: string, setter: (arr: string[]) => void) => {
    if (item && !array.includes(item)) {
      setter([...array, item]);
    }
  };

  const removeFromArray = (array: string[], item: string, setter: (arr: string[]) => void) => {
    setter(array.filter(i => i !== item));
  };

  const handleSave = () => {
    if (!icp.name) {
      alert('Please provide a name for this ICP');
      return;
    }
    onSave(icp);
  };

  const loadPreset = (preset: CandidateICP) => {
    setICP({ ...preset, id: undefined });
  };

  // Preset templates
  const presetTemplates: CandidateICP[] = [
    {
      name: 'Senior Full-Stack Engineer',
      description: 'Experienced full-stack developer for web applications',
      title_keywords: ['Senior Software Engineer', 'Full Stack Developer', 'Lead Developer'],
      required_skills: ['JavaScript', 'React', 'Node.js', 'SQL'],
      preferred_skills: ['TypeScript', 'AWS', 'Docker', 'GraphQL'],
      min_experience: 5,
      max_experience: 15,
      education_requirements: {
        level: 'bachelor',
        fields: ['Computer Science', 'Software Engineering']
      },
      location_preferences: {
        cities: [],
        remote_acceptable: true,
        relocation_required: false
      },
      company_preferences: {
        industries: ['Technology', 'SaaS'],
        company_sizes: ['startup', 'mid-size'],
        company_names: []
      },
      salary_range: {
        min: 120000,
        max: 180000,
        currency: 'USD'
      },
      culture_fit: ['collaborative', 'fast-paced', 'innovative'],
      certifications: [],
      languages: ['English'],
      availability: {
        notice_period_max_weeks: 4,
        immediate_only: false
      }
    },
    {
      name: 'Data Scientist',
      description: 'ML/AI specialist with strong statistical background',
      title_keywords: ['Data Scientist', 'Machine Learning Engineer', 'AI Engineer'],
      required_skills: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
      preferred_skills: ['TensorFlow', 'PyTorch', 'Spark', 'Cloud Platforms'],
      min_experience: 3,
      max_experience: 10,
      education_requirements: {
        level: 'master',
        fields: ['Data Science', 'Computer Science', 'Statistics', 'Mathematics']
      },
      location_preferences: {
        cities: [],
        remote_acceptable: true,
        relocation_required: false
      },
      company_preferences: {
        industries: ['Technology', 'Finance', 'Healthcare'],
        company_sizes: ['mid-size', 'enterprise'],
        company_names: []
      },
      salary_range: {
        min: 130000,
        max: 200000,
        currency: 'USD'
      },
      culture_fit: ['research-oriented', 'data-driven', 'innovative'],
      certifications: [],
      languages: ['English'],
      availability: {
        notice_period_max_weeks: 6,
        immediate_only: false
      }
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-white border border-indigo-200 flex items-center justify-center">
              <UserGroupIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Candidate ICP Builder</h2>
              <p className="text-sm text-gray-600">Define your ideal candidate profile</p>
            </div>
          </div>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-4 overflow-y-auto max-h-[calc(90vh-140px)]">
        {/* Presets */}
        {presetTemplates.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Start from a template:</h3>
            <div className="flex gap-2">
              {presetTemplates.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => loadPreset(preset)}
                  className="px-3 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 text-sm"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ICP Name *
            </label>
            <input
              type="text"
              value={icp.name}
              onChange={(e) => setICP({ ...icp, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Senior Backend Engineer"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={icp.description}
              onChange={(e) => setICP({ ...icp, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              rows={2}
              placeholder="Brief description of the ideal candidate..."
            />
          </div>
        </div>

        {/* Title & Experience */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Title & Experience</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToArray(icp.title_keywords, titleInput, (arr) => 
                      setICP({ ...icp, title_keywords: arr }));
                    setTitleInput('');
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Software Engineer"
              />
              <button
                onClick={() => {
                  addToArray(icp.title_keywords, titleInput, (arr) => 
                    setICP({ ...icp, title_keywords: arr }));
                  setTitleInput('');
                }}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {icp.title_keywords.map(title => (
                <span key={title} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm flex items-center gap-1">
                  {title}
                  <button
                    onClick={() => removeFromArray(icp.title_keywords, title, (arr) => 
                      setICP({ ...icp, title_keywords: arr }))}
                    className="ml-1"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Years of Experience
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                value={icp.min_experience}
                onChange={(e) => setICP({ ...icp, min_experience: parseInt(e.target.value) || 0 })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
              />
              <span>to</span>
              <input
                type="number"
                value={icp.max_experience}
                onChange={(e) => setICP({ ...icp, max_experience: parseInt(e.target.value) || 0 })}
                className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
              />
              <span className="text-sm text-gray-500">years</span>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Skills</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={requiredSkillInput}
                onChange={(e) => setRequiredSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToArray(icp.required_skills, requiredSkillInput, (arr) => 
                      setICP({ ...icp, required_skills: arr }));
                    setRequiredSkillInput('');
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Python"
              />
              <button
                onClick={() => {
                  addToArray(icp.required_skills, requiredSkillInput, (arr) => 
                    setICP({ ...icp, required_skills: arr }));
                  setRequiredSkillInput('');
                }}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {icp.required_skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm flex items-center gap-1">
                  {skill}
                  <button
                    onClick={() => removeFromArray(icp.required_skills, skill, (arr) => 
                      setICP({ ...icp, required_skills: arr }))}
                    className="ml-1"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Preferred Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={preferredSkillInput}
                onChange={(e) => setPreferredSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addToArray(icp.preferred_skills, preferredSkillInput, (arr) => 
                      setICP({ ...icp, preferred_skills: arr }));
                    setPreferredSkillInput('');
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g., Docker"
              />
              <button
                onClick={() => {
                  addToArray(icp.preferred_skills, preferredSkillInput, (arr) => 
                    setICP({ ...icp, preferred_skills: arr }));
                  setPreferredSkillInput('');
                }}
                className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {icp.preferred_skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                  {skill}
                  <button
                    onClick={() => removeFromArray(icp.preferred_skills, skill, (arr) => 
                      setICP({ ...icp, preferred_skills: arr }))}
                    className="ml-1"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Education</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Education Level
              </label>
              <select
                value={icp.education_requirements.level}
                onChange={(e) => setICP({
                  ...icp,
                  education_requirements: {
                    ...icp.education_requirements,
                    level: e.target.value
                  }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">No requirement</option>
                <option value="high_school">High School</option>
                <option value="associate">Associate</option>
                <option value="bachelor">Bachelor's</option>
                <option value="master">Master's</option>
                <option value="phd">PhD</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preferred Fields
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={educationFieldInput}
                  onChange={(e) => setEducationFieldInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addToArray(icp.education_requirements.fields, educationFieldInput, (arr) => 
                        setICP({
                          ...icp,
                          education_requirements: {
                            ...icp.education_requirements,
                            fields: arr
                          }
                        }));
                      setEducationFieldInput('');
                    }
                  }}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Computer Science"
                />
                <button
                  onClick={() => {
                    addToArray(icp.education_requirements.fields, educationFieldInput, (arr) => 
                      setICP({
                        ...icp,
                        education_requirements: {
                          ...icp.education_requirements,
                          fields: arr
                        }
                      }));
                    setEducationFieldInput('');
                  }}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {icp.education_requirements.fields.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {icp.education_requirements.fields.map(field => (
                <span key={field} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                  {field}
                  <button
                    onClick={() => removeFromArray(icp.education_requirements.fields, field, (arr) => 
                      setICP({
                        ...icp,
                        education_requirements: {
                          ...icp.education_requirements,
                          fields: arr
                        }
                      }))}
                    className="ml-1"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Location & Availability */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Location & Availability</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={icp.location_preferences.remote_acceptable}
                  onChange={(e) => setICP({
                    ...icp,
                    location_preferences: {
                      ...icp.location_preferences,
                      remote_acceptable: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remote Acceptable</span>
              </label>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={icp.location_preferences.relocation_required}
                  onChange={(e) => setICP({
                    ...icp,
                    location_preferences: {
                      ...icp.location_preferences,
                      relocation_required: e.target.checked
                    }
                  })}
                  className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Relocation Required</span>
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Notice Period (weeks)
            </label>
            <input
              type="number"
              value={icp.availability.notice_period_max_weeks}
              onChange={(e) => setICP({
                ...icp,
                availability: {
                  ...icp.availability,
                  notice_period_max_weeks: parseInt(e.target.value) || 0
                }
              })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
              min="0"
            />
          </div>
        </div>

        {/* Salary Range */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wider">Salary Range</h3>
          
          <div className="flex gap-4 items-center">
            <select
              value={icp.salary_range.currency}
              onChange={(e) => setICP({
                ...icp,
                salary_range: {
                  ...icp.salary_range,
                  currency: e.target.value
                }
              })}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
            
            <input
              type="number"
              value={icp.salary_range.min}
              onChange={(e) => setICP({
                ...icp,
                salary_range: {
                  ...icp.salary_range,
                  min: parseInt(e.target.value) || 0
                }
              })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Min"
            />
            
            <span>to</span>
            
            <input
              type="number"
              value={icp.salary_range.max}
              onChange={(e) => setICP({
                ...icp,
                salary_range: {
                  ...icp.salary_range,
                  max: parseInt(e.target.value) || 0
                }
              })}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Max"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <CheckIcon className="h-5 w-5" />
          Save ICP
        </button>
      </div>
    </div>
  );
}