'use client';

import { useState } from 'react';

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

export function CompanyFilters() {
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: 'hiring-urgency',
      title: 'Hiring Urgency',
      type: 'checkbox',
      options: [
        { id: 'immediate', label: 'Immediate Needs', count: 58 },
        { id: 'next-quarter', label: 'Next Quarter', count: 42 },
        { id: 'ongoing', label: 'Ongoing', count: 76 },
      ],
    },
    {
      id: 'hiring-volume',
      title: 'Hiring Volume',
      type: 'checkbox',
      options: [
        { id: 'high-volume', label: 'High (10+ roles)', count: 32 },
        { id: 'medium-volume', label: 'Medium (5-9 roles)', count: 45 },
        { id: 'low-volume', label: 'Low (1-4 roles)', count: 65 },
      ],
    },
    {
      id: 'growth-stage',
      title: 'Growth Stage',
      type: 'checkbox',
      options: [
        { id: 'startup', label: 'Startup', count: 42 },
        { id: 'scale-up', label: 'Scale-up', count: 36 },
        { id: 'enterprise', label: 'Enterprise', count: 28 },
        { id: 'smb', label: 'SMB', count: 38 },
      ],
    },
    {
      id: 'funding-status',
      title: 'Funding Status',
      type: 'checkbox',
      options: [
        { id: 'seed', label: 'Seed', count: 32 },
        { id: 'series-a', label: 'Series A', count: 28 },
        { id: 'series-b', label: 'Series B', count: 24 },
        { id: 'series-c-plus', label: 'Series C+', count: 18 },
        { id: 'public', label: 'Public', count: 15 },
        { id: 'bootstrapped', label: 'Bootstrapped', count: 22 },
      ],
    },
    {
      id: 'industry',
      title: 'Industry',
      type: 'checkbox',
      options: [
        { id: 'tech', label: 'Technology', count: 45 },
        { id: 'healthcare', label: 'Healthcare', count: 32 },
        { id: 'finance', label: 'Finance', count: 28 },
        { id: 'education', label: 'Education', count: 21 },
        { id: 'ecommerce', label: 'E-commerce', count: 19 },
      ],
    },
    {
      id: 'recruiting-partner-status',
      title: 'Recruiting Partner Status',
      type: 'checkbox',
      options: [
        { id: 'no-partners', label: 'No Current Partners', count: 48 },
        { id: 'open-to-new', label: 'Open to New Partners', count: 65 },
        { id: 'actively-seeking', label: 'Actively Seeking Partners', count: 32 },
      ],
    },
    {
      id: 'hiring-challenges',
      title: 'Hiring Challenges',
      type: 'checkbox',
      options: [
        { id: 'technical-roles', label: 'Technical Roles', count: 52 },
        { id: 'executive-search', label: 'Executive Search', count: 28 },
        { id: 'diversity-hiring', label: 'Diversity Hiring', count: 36 },
        { id: 'scaling-teams', label: 'Scaling Teams Quickly', count: 42 },
        { id: 'specialized-skills', label: 'Specialized Skills', count: 38 },
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
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Filters</h2>
      
      {filters.map((section) => (
        <div key={section.id} className="border-b border-gray-200 pb-6">
          <h3 className="font-medium text-gray-900 mb-3">{section.title}</h3>
          <div className="space-y-2">
            {section.options.map((option) => (
              <div key={option.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id={`${section.id}-${option.id}`}
                    name={section.id}
                    type={section.type === 'radio' ? 'radio' : 'checkbox'}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={option.selected}
                    onChange={() => toggleFilterOption(section.id, option.id)}
                  />
                  <label
                    htmlFor={`${section.id}-${option.id}`}
                    className="ml-3 text-sm text-gray-600"
                  >
                    {option.label}
                  </label>
                </div>
                <span className="text-xs text-gray-500">{option.count}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <button
        type="button"
        className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Reset Filters
      </button>
    </div>
  );
}
