'use client';

import { useState } from 'react';
import { 
  BuildingOfficeIcon, 
  UserGroupIcon, 
  MapPinIcon, 
  CurrencyDollarIcon,
  TagIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface ICPCriteria {
  name: string;
  description: string;
  industries: string[];
  company_size_min?: number;
  company_size_max?: number;
  revenue_min?: number;
  revenue_max?: number;
  locations: string[];
  technologies: string[];
  job_titles: string[];
  pain_points: string[];
  exclude_keywords: string[];
  notes?: string;
}

interface ICPBuilderProps {
  onSave: (criteria: ICPCriteria) => void;
  onCancel: () => void;
  initialValues?: Partial<ICPCriteria>;
}

export function ICPBuilder({ onSave, onCancel, initialValues }: ICPBuilderProps) {
  const [criteria, setCriteria] = useState<ICPCriteria>({
    name: initialValues?.name || '',
    description: initialValues?.description || '',
    industries: initialValues?.industries || [],
    company_size_min: initialValues?.company_size_min,
    company_size_max: initialValues?.company_size_max,
    revenue_min: initialValues?.revenue_min,
    revenue_max: initialValues?.revenue_max,
    locations: initialValues?.locations || [],
    technologies: initialValues?.technologies || [],
    job_titles: initialValues?.job_titles || [],
    pain_points: initialValues?.pain_points || [],
    exclude_keywords: initialValues?.exclude_keywords || [],
    notes: initialValues?.notes || ''
  });

  const [inputValues, setInputValues] = useState({
    industry: '',
    location: '',
    technology: '',
    job_title: '',
    pain_point: '',
    exclude: ''
  });

  const handleAddItem = (field: keyof typeof inputValues, arrayField: keyof ICPCriteria) => {
    const value = inputValues[field].trim();
    if (value && Array.isArray(criteria[arrayField])) {
      setCriteria({
        ...criteria,
        [arrayField]: [...(criteria[arrayField] as string[]), value]
      });
      setInputValues({ ...inputValues, [field]: '' });
    }
  };

  const handleRemoveItem = (arrayField: keyof ICPCriteria, index: number) => {
    if (Array.isArray(criteria[arrayField])) {
      const newArray = [...(criteria[arrayField] as string[])];
      newArray.splice(index, 1);
      setCriteria({ ...criteria, [arrayField]: newArray });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(criteria);
  };

  const suggestedIndustries = ['SaaS', 'Healthcare', 'FinTech', 'E-commerce', 'Manufacturing', 'Logistics'];
  const suggestedTechnologies = ['AWS', 'React', 'Python', 'Kubernetes', 'PostgreSQL', 'Node.js'];
  const suggestedTitles = ['VP Engineering', 'CTO', 'Head of Product', 'Engineering Manager', 'Director of Engineering'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-5xl mx-auto">
      <div className="mb-3">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-600" />
          ICP Builder
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Name *
            </label>
            <input
              type="text"
              required
              value={criteria.name}
              onChange={(e) => setCriteria({ ...criteria, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Enterprise SaaS Companies"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={criteria.description}
              onChange={(e) => setCriteria({ ...criteria, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Brief description of this ICP"
            />
          </div>
        </div>

        {/* Company Size & Revenue */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <UserGroupIcon className="inline h-4 w-4 mr-1" />
              Company Size (Employees)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={criteria.company_size_min || ''}
                onChange={(e) => setCriteria({ ...criteria, company_size_min: parseInt(e.target.value) || undefined })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <span className="self-center">to</span>
              <input
                type="number"
                value={criteria.company_size_max || ''}
                onChange={(e) => setCriteria({ ...criteria, company_size_max: parseInt(e.target.value) || undefined })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <CurrencyDollarIcon className="inline h-4 w-4 mr-1" />
              Annual Revenue ($M)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={criteria.revenue_min || ''}
                onChange={(e) => setCriteria({ ...criteria, revenue_min: parseInt(e.target.value) || undefined })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Min"
              />
              <span className="self-center">to</span>
              <input
                type="number"
                value={criteria.revenue_max || ''}
                onChange={(e) => setCriteria({ ...criteria, revenue_max: parseInt(e.target.value) || undefined })}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Max"
              />
            </div>
          </div>
        </div>

        {/* Industries */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <TagIcon className="inline h-4 w-4 mr-1" />
            Target Industries
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputValues.industry}
              onChange={(e) => setInputValues({ ...inputValues, industry: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('industry', 'industries'))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add industry..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('industry', 'industries')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {criteria.industries.map((industry, index) => (
              <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center">
                {industry}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('industries', index)}
                  className="ml-2 text-blue-500 hover:text-blue-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {suggestedIndustries.filter(i => !criteria.industries.includes(i)).map(industry => (
              <button
                key={industry}
                type="button"
                onClick={() => setCriteria({ ...criteria, industries: [...criteria.industries, industry] })}
                className="text-xs px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                + {industry}
              </button>
            ))}
          </div>
        </div>

        {/* Locations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <MapPinIcon className="inline h-4 w-4 mr-1" />
            Target Locations
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputValues.location}
              onChange={(e) => setInputValues({ ...inputValues, location: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('location', 'locations'))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add location (city, state, or country)..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('location', 'locations')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {criteria.locations.map((location, index) => (
              <span key={index} className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center">
                {location}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('locations', index)}
                  className="ml-2 text-green-500 hover:text-green-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technologies They Use
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputValues.technology}
              onChange={(e) => setInputValues({ ...inputValues, technology: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('technology', 'technologies'))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add technology..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('technology', 'technologies')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {criteria.technologies.map((tech, index) => (
              <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center">
                {tech}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('technologies', index)}
                  className="ml-2 text-purple-500 hover:text-purple-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {suggestedTechnologies.filter(t => !criteria.technologies.includes(t)).map(tech => (
              <button
                key={tech}
                type="button"
                onClick={() => setCriteria({ ...criteria, technologies: [...criteria.technologies, tech] })}
                className="text-xs px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                + {tech}
              </button>
            ))}
          </div>
        </div>

        {/* Decision Maker Titles */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Decision Maker Titles
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputValues.job_title}
              onChange={(e) => setInputValues({ ...inputValues, job_title: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('job_title', 'job_titles'))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add job title..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('job_title', 'job_titles')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {criteria.job_titles.map((title, index) => (
              <span key={index} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm flex items-center">
                {title}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('job_titles', index)}
                  className="ml-2 text-orange-500 hover:text-orange-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap">
            {suggestedTitles.filter(t => !criteria.job_titles.includes(t)).map(title => (
              <button
                key={title}
                type="button"
                onClick={() => setCriteria({ ...criteria, job_titles: [...criteria.job_titles, title] })}
                className="text-xs px-2 py-1 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                + {title}
              </button>
            ))}
          </div>
        </div>

        {/* Pain Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Pain Points / Challenges
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputValues.pain_point}
              onChange={(e) => setInputValues({ ...inputValues, pain_point: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('pain_point', 'pain_points'))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add pain point they face..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('pain_point', 'pain_points')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {criteria.pain_points.map((pain, index) => (
              <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm flex items-center">
                {pain}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('pain_points', index)}
                  className="ml-2 text-yellow-500 hover:text-yellow-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Exclude Keywords */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exclude Keywords
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={inputValues.exclude}
              onChange={(e) => setInputValues({ ...inputValues, exclude: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddItem('exclude', 'exclude_keywords'))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Keywords to exclude..."
            />
            <button
              type="button"
              onClick={() => handleAddItem('exclude', 'exclude_keywords')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {criteria.exclude_keywords.map((keyword, index) => (
              <span key={index} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm flex items-center">
                {keyword}
                <button
                  type="button"
                  onClick={() => handleRemoveItem('exclude_keywords', index)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Additional Notes
          </label>
          <textarea
            value={criteria.notes}
            onChange={(e) => setCriteria({ ...criteria, notes: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Any other criteria or notes..."
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <CheckCircleIcon className="h-5 w-5 mr-2" />
            Save ICP Profile
          </button>
        </div>
      </form>
    </div>
  );
}