'use client';

import { useState } from 'react';
import { FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';

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

export function JobFilters() {
  const [filters, setFilters] = useState<FilterSection[]>([
    {
      id: 'job-type',
      title: 'Job Type',
      type: 'checkbox',
      options: [
        { id: 'full-time', label: 'Full-time', count: 24, selected: false },
        { id: 'part-time', label: 'Part-time', count: 8, selected: false },
        { id: 'contract', label: 'Contract', count: 12, selected: false },
        { id: 'internship', label: 'Internship', count: 5, selected: false },
        { id: 'temporary', label: 'Temporary', count: 3, selected: false },
      ],
    },
    {
      id: 'experience-level',
      title: 'Experience Level',
      type: 'checkbox',
      options: [
        { id: 'entry', label: 'Entry Level', count: 15, selected: false },
        { id: 'mid', label: 'Mid Level', count: 28, selected: false },
        { id: 'senior', label: 'Senior Level', count: 19, selected: false },
        { id: 'lead', label: 'Lead', count: 7, selected: false },
        { id: 'manager', label: 'Manager', count: 9, selected: false },
      ],
    },
    {
      id: 'salary-range',
      title: 'Salary Range',
      type: 'radio',
      options: [
        { id: 'all', label: 'All', count: 0, selected: true },
        { id: '0-50k', label: '$0 - $50,000', count: 12, selected: false },
        { id: '50k-100k', label: '$50,000 - $100,000', count: 28, selected: false },
        { id: '100k-150k', label: '$100,000 - $150,000', count: 34, selected: false },
        { id: '150k-plus', label: '$150,000+', count: 18, selected: false },
      ],
    },
    {
      id: 'remote',
      title: 'Remote',
      type: 'checkbox',
      options: [
        { id: 'remote-only', label: 'Remote Only', count: 32, selected: false },
        { id: 'hybrid', label: 'Hybrid', count: 18, selected: false },
        { id: 'on-site', label: 'On-site', count: 25, selected: false },
      ],
    },
    {
      id: 'date-posted',
      title: 'Date Posted',
      type: 'radio',
      options: [
        { id: 'anytime', label: 'Anytime', count: 0, selected: true },
        { id: '24h', label: 'Last 24 hours', count: 12, selected: false },
        { id: 'week', label: 'Last week', count: 34, selected: false },
        { id: 'month', label: 'Last month', count: 56, selected: false },
      ],
    },
  ]);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

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

  const clearAllFilters = () => {
    setFilters(
      filters.map((section) => ({
        ...section,
        options: section.options.map((option) => ({
          ...option,
          selected: section.type === 'radio' ? option.id === 'all' || option.id === 'anytime' : false,
        })),
      }))
    );
  };

  const selectedFiltersCount = filters
    .flatMap((section) => section.options)
    .filter((option) => option.selected).length;

  return (
    <div className="space-y-6">
      {/* Mobile filter dialog */}
      <div className="lg:hidden">
        <button
          type="button"
          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
          onClick={() => setIsMobileFiltersOpen(true)}
        >
          <FunnelIcon className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" />
          Filters
          {selectedFiltersCount > 0 && (
            <span className="ml-1.5 rounded bg-gray-200 px-1.5 py-0.5 text-xs font-semibold text-gray-700">
              {selectedFiltersCount}
            </span>
          )}
        </button>

        {isMobileFiltersOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto p-4">
            <div className="fixed inset-0 bg-black/25" onClick={() => setIsMobileFiltersOpen(false)} />
            <div className="relative mx-auto max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl">
              <div className="sticky top-0 z-10 bg-white px-4 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsMobileFiltersOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                {selectedFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <div className="p-4 space-y-6">
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
                              checked={option.selected || false}
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
              </div>
              <div className="sticky bottom-0 bg-white border-t border-gray-200 px-4 py-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // Apply filters
                    setIsMobileFiltersOpen(false);
                  }}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Desktop filters */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Filters</h2>
          {selectedFiltersCount > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear all
            </button>
          )}
        </div>

        <div className="space-y-6">
          {filters.map((section) => (
            <div key={section.id} className="border-b border-gray-200 pb-6">
              <h3 className="font-medium text-gray-900 mb-3">{section.title}</h3>
              <div className="space-y-2">
                {section.options.map((option) => (
                  <div key={option.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id={`${section.id}-${option.id}-desktop`}
                        name={`${section.id}-desktop`}
                        type={section.type}
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        checked={option.selected || false}
                        onChange={() => toggleFilterOption(section.id, option.id)}
                      />
                      <label
                        htmlFor={`${section.id}-${option.id}-desktop`}
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
        </div>
      </div>
    </div>
  );
}
