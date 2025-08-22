'use client';

import { useState, useEffect } from 'react';

type FilterOption = {
  id: string;
  label: string;
  count: number;
  selected?: boolean;
};

type FilterSection = {
  id: string;
  title: string;
  type: 'checkbox' | 'radio' | 'range';
  options: FilterOption[];
};

// Default ICP Profile - matching database fields
const DEFAULT_ICP = {
  name: 'High-Growth Tech Startups',
  description: 'Companies experiencing rapid growth and needing recruiting expertise',
  selectedFilters: {
    'hiring-urgency': ['high'],
    'growth-stage': ['seed', 'series-a'],
    'industry': ['Technology', 'SaaS'],
    'partner-status': ['lead', 'prospect'],
    'company-size': ['11-50', '51-200']
  }
};

// Available ICP profiles
const ICP_PROFILES = [
  {
    id: 'tech-startups',
    name: 'High-Growth Tech Startups',
    description: 'Early-stage tech companies with aggressive hiring needs',
    filters: {
      'hiring-urgency': ['high'],
      'growth-stage': ['seed', 'series-a'],
      'industry': ['Technology', 'SaaS'],
      'partner-status': ['lead', 'prospect'],
      'company-size': ['11-50', '51-200']
    }
  },
  {
    id: 'enterprise',
    name: 'Enterprise Clients',
    description: 'Large companies with ongoing recruiting needs',
    filters: {
      'growth-stage': ['growth', 'enterprise'],
      'industry': ['Technology', 'Finance', 'Healthcare'],
      'partner-status': ['lead', 'prospect'],
      'company-size': ['201-500', '501-1000', '1000+']
    }
  },
  {
    id: 'healthcare',
    name: 'Healthcare & Biotech',
    description: 'Healthcare companies needing specialized talent',
    filters: {
      'industry': ['Healthcare', 'Biotech', 'Medical Devices'],
      'partner-status': ['lead', 'prospect'],
      'hiring-urgency': ['high', 'medium']
    }
  }
];

interface CompanyFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function CompanyFilters({ onFiltersChange }: CompanyFiltersProps) {
  const [selectedProfile, setSelectedProfile] = useState(ICP_PROFILES[0]);
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: 'partner-status',
      title: 'Partnership Status',
      type: 'checkbox',
      options: [
        { id: 'lead', label: 'Lead', count: 0, selected: true },
        { id: 'prospect', label: 'Prospect', count: 0, selected: true },
        { id: 'active', label: 'Active Partner', count: 0 },
        { id: 'inactive', label: 'Inactive', count: 0 },
      ],
    },
    {
      id: 'hiring-urgency',
      title: 'Hiring Urgency',
      type: 'checkbox',
      options: [
        { id: 'high', label: 'High Priority', count: 0, selected: true },
        { id: 'medium', label: 'Medium Priority', count: 0 },
        { id: 'low', label: 'Low Priority', count: 0 },
      ],
    },
    {
      id: 'growth-stage',
      title: 'Growth Stage',
      type: 'checkbox',
      options: [
        { id: 'seed', label: 'Seed', count: 0, selected: true },
        { id: 'series-a', label: 'Series A', count: 0, selected: true },
        { id: 'series-b', label: 'Series B', count: 0 },
        { id: 'growth', label: 'Growth', count: 0 },
        { id: 'enterprise', label: 'Enterprise', count: 0 },
      ],
    },
    {
      id: 'industry',
      title: 'Industry',
      type: 'checkbox',
      options: [
        { id: 'Technology', label: 'Technology', count: 0, selected: true },
        { id: 'SaaS', label: 'SaaS', count: 0, selected: true },
        { id: 'Healthcare', label: 'Healthcare', count: 0 },
        { id: 'Finance', label: 'Finance', count: 0 },
        { id: 'E-commerce', label: 'E-commerce', count: 0 },
        { id: 'Biotech', label: 'Biotech', count: 0 },
        { id: 'Manufacturing', label: 'Manufacturing', count: 0 },
      ],
    },
    {
      id: 'company-size',
      title: 'Company Size',
      type: 'checkbox',
      options: [
        { id: '1-10', label: '1-10 employees', count: 0 },
        { id: '11-50', label: '11-50 employees', count: 0, selected: true },
        { id: '51-200', label: '51-200 employees', count: 0, selected: true },
        { id: '201-500', label: '201-500 employees', count: 0 },
        { id: '501-1000', label: '501-1000 employees', count: 0 },
        { id: '1000+', label: '1000+ employees', count: 0 },
      ],
    },
  ]);

  const toggleFilterOption = (sectionId: string, optionId: string) => {
    setFilters(
      filters.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              options: section.options.map((option) =>
                option.id === optionId
                  ? { ...option, selected: !option.selected }
                  : section.type === 'radio'
                  ? { ...option, selected: option.id === optionId }
                  : option
              ),
            }
          : section
      )
    );
  };

  return (
    <div className="space-y-3">
      {filters.map((section) => (
        <div key={section.id} className="border-b border-gray-700 pb-2">
          <h3 className="font-medium text-white mb-1 text-xs uppercase tracking-wider">{section.title}</h3>
          <div className="space-y-0.5">
            {section.options.map((option) => (
              <div key={option.id} className="flex items-center justify-between py-0.5">
                <div className="flex items-center">
                  <input
                    id={`${section.id}-${option.id}`}
                    name={section.id}
                    type={section.type === 'radio' ? 'radio' : 'checkbox'}
                    className="h-3 w-3 rounded border-gray-600 bg-gray-800 text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                    checked={option.selected}
                    onChange={() => toggleFilterOption(section.id, option.id)}
                  />
                  <label
                    htmlFor={`${section.id}-${option.id}`}
                    className="ml-2 text-xs text-gray-300 cursor-pointer hover:text-white"
                  >
                    {option.label}
                  </label>
                </div>
                {option.count > 0 && (
                  <span className="text-xs text-gray-500">{option.count}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button
        type="button"
        className="w-full px-2 py-1.5 border border-gray-600 rounded text-xs font-medium text-gray-300 bg-gray-800 hover:bg-gray-700 hover:text-white transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}
