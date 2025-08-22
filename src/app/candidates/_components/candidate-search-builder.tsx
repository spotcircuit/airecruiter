'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon,
  SparklesIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  XMarkIcon,
  PlusIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

type SearchMode = 'template' | 'boolean' | 'ai';

interface SearchTemplate {
  id: string;
  name: string;
  description: string;
  query: any;
}

interface CandidateSearchBuilderProps {
  onSearch: (query: any) => void;
  onSaveSearch?: (search: SearchTemplate) => void;
  savedSearches?: SearchTemplate[];
}

export function CandidateSearchBuilder({ 
  onSearch, 
  onSaveSearch,
  savedSearches = []
}: CandidateSearchBuilderProps) {
  const [searchMode, setSearchMode] = useState<SearchMode>('template');
  const [showSavedSearches, setShowSavedSearches] = useState(false);
  
  // Template Search State
  const [templateSearch, setTemplateSearch] = useState({
    title: '',
    location: '',
    experience_min: '',
    experience_max: '',
    skills: [] as string[],
    education_level: '',
    company: '',
    industry: '',
    keywords: [] as string[],
    willing_to_relocate: false,
    remote_only: false
  });

  // Boolean Search State
  const [booleanQuery, setBooleanQuery] = useState('');
  
  // AI Search State
  const [aiPrompt, setAiPrompt] = useState('');
  
  // Skills and Keywords Input
  const [skillInput, setSkillInput] = useState('');
  const [keywordInput, setKeywordInput] = useState('');

  const handleTemplateSearch = () => {
    const query = {
      type: 'template',
      ...templateSearch,
      experience_range: templateSearch.experience_min || templateSearch.experience_max 
        ? [templateSearch.experience_min || 0, templateSearch.experience_max || 100]
        : undefined
    };
    onSearch(query);
  };

  const handleBooleanSearch = () => {
    onSearch({
      type: 'boolean',
      query: booleanQuery
    });
  };

  const handleAISearch = () => {
    onSearch({
      type: 'ai',
      prompt: aiPrompt
    });
  };

  const addSkill = () => {
    if (skillInput && !templateSearch.skills.includes(skillInput)) {
      setTemplateSearch({
        ...templateSearch,
        skills: [...templateSearch.skills, skillInput]
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setTemplateSearch({
      ...templateSearch,
      skills: templateSearch.skills.filter(s => s !== skill)
    });
  };

  const addKeyword = () => {
    if (keywordInput && !templateSearch.keywords.includes(keywordInput)) {
      setTemplateSearch({
        ...templateSearch,
        keywords: [...templateSearch.keywords, keywordInput]
      });
      setKeywordInput('');
    }
  };

  const removeKeyword = (keyword: string) => {
    setTemplateSearch({
      ...templateSearch,
      keywords: templateSearch.keywords.filter(k => k !== keyword)
    });
  };

  const clearTemplateSearch = () => {
    setTemplateSearch({
      title: '',
      location: '',
      experience_min: '',
      experience_max: '',
      skills: [],
      education_level: '',
      company: '',
      industry: '',
      keywords: [],
      willing_to_relocate: false,
      remote_only: false
    });
  };

  const saveCurrentSearch = () => {
    if (!onSaveSearch) return;
    
    const searchName = prompt('Enter a name for this search:');
    if (!searchName) return;
    
    const searchToSave: SearchTemplate = {
      id: Date.now().toString(),
      name: searchName,
      description: `Search for ${templateSearch.title || 'candidates'} with ${templateSearch.skills.length} skills`,
      query: searchMode === 'template' ? templateSearch : 
             searchMode === 'boolean' ? { type: 'boolean', query: booleanQuery } :
             { type: 'ai', prompt: aiPrompt }
    };
    
    onSaveSearch(searchToSave);
  };

  const loadSavedSearch = (search: SearchTemplate) => {
    if (search.query.type === 'boolean') {
      setSearchMode('boolean');
      setBooleanQuery(search.query.query);
    } else if (search.query.type === 'ai') {
      setSearchMode('ai');
      setAiPrompt(search.query.prompt);
    } else {
      setSearchMode('template');
      setTemplateSearch(search.query);
    }
    setShowSavedSearches(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      {/* Search Mode Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <button
            onClick={() => setSearchMode('template')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              searchMode === 'template'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <DocumentTextIcon className="h-5 w-5 inline mr-2" />
            Template
          </button>
          <button
            onClick={() => setSearchMode('boolean')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              searchMode === 'boolean'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <CodeBracketIcon className="h-5 w-5 inline mr-2" />
            Boolean
          </button>
          <button
            onClick={() => setSearchMode('ai')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              searchMode === 'ai'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <SparklesIcon className="h-5 w-5 inline mr-2" />
            AI Prompt
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={saveCurrentSearch}
            className="px-3 py-2 text-gray-600 hover:text-gray-800"
            title="Save Search"
          >
            <BookmarkIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowSavedSearches(!showSavedSearches)}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Saved Searches ({savedSearches.length})
          </button>
        </div>
      </div>

      {/* Saved Searches Dropdown */}
      {showSavedSearches && savedSearches.length > 0 && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Saved Searches</h4>
          <div className="space-y-2">
            {savedSearches.map(search => (
              <button
                key={search.id}
                onClick={() => loadSavedSearch(search)}
                className="w-full text-left px-3 py-2 bg-white rounded hover:bg-blue-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{search.name}</div>
                <div className="text-xs text-gray-500">{search.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Template Search */}
      {searchMode === 'template' && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600 mb-4">
            Fill in any of the fields below to search for candidates:
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Title
              </label>
              <input
                type="text"
                value={templateSearch.title}
                onChange={(e) => setTemplateSearch({ ...templateSearch, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Software Engineer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={templateSearch.location}
                onChange={(e) => setTemplateSearch({ ...templateSearch, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., San Francisco"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Years of Experience
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={templateSearch.experience_min}
                  onChange={(e) => setTemplateSearch({ ...templateSearch, experience_min: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Min"
                />
                <span className="flex items-center">to</span>
                <input
                  type="number"
                  value={templateSearch.experience_max}
                  onChange={(e) => setTemplateSearch({ ...templateSearch, experience_max: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <input
                type="text"
                value={templateSearch.industry}
                onChange={(e) => setTemplateSearch({ ...templateSearch, industry: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Aerospace"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Previous Company
              </label>
              <input
                type="text"
                value={templateSearch.company}
                onChange={(e) => setTemplateSearch({ ...templateSearch, company: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., SpaceX"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Education Level
              </label>
              <select
                value={templateSearch.education_level}
                onChange={(e) => setTemplateSearch({ ...templateSearch, education_level: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Any</option>
                <option value="high_school">High School</option>
                <option value="associate">Associate</option>
                <option value="bachelor">Bachelor's</option>
                <option value="master">Master's</option>
                <option value="phd">PhD</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Python, React, AWS"
              />
              <button
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {templateSearch.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-1">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keywords
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., rocket scientist, machine learning"
              />
              <button
                onClick={addKeyword}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="h-5 w-5" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {templateSearch.keywords.map(keyword => (
                <span key={keyword} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm flex items-center gap-1">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-1">
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={templateSearch.willing_to_relocate}
                onChange={(e) => setTemplateSearch({ ...templateSearch, willing_to_relocate: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Willing to Relocate</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={templateSearch.remote_only}
                onChange={(e) => setTemplateSearch({ ...templateSearch, remote_only: e.target.checked })}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Remote Only</span>
            </label>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={clearTemplateSearch}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear Fields
            </button>
            <button
              onClick={handleTemplateSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      )}

      {/* Boolean Search */}
      {searchMode === 'boolean' && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Enter a Boolean search query using AND, OR, NOT operators:
          </div>
          
          <textarea
            value={booleanQuery}
            onChange={(e) => setBooleanQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder='e.g., ("software engineer" OR developer) AND (Python OR JavaScript) AND "machine learning" NOT junior'
          />
          
          <div className="text-xs text-gray-500">
            <p className="font-medium mb-1">Quick Reference:</p>
            <ul className="space-y-1">
              <li>• Use quotes for exact phrases: "machine learning"</li>
              <li>• AND: Both terms must be present</li>
              <li>• OR: Either term can be present</li>
              <li>• NOT: Exclude terms</li>
              <li>• Use parentheses to group terms: (Python OR Java)</li>
            </ul>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => setBooleanQuery('')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={handleBooleanSearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      )}

      {/* AI Search */}
      {searchMode === 'ai' && (
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Describe the ideal candidate in natural language:
          </div>
          
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder="e.g., I'm looking for a senior full-stack engineer with 5+ years of experience in React and Node.js. They should have worked at a fast-growing startup and have experience with AWS and microservices. Bonus if they have machine learning experience."
          />
          
          <div className="flex gap-3">
            <button
              onClick={() => setAiPrompt('')}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Clear
            </button>
            <button
              onClick={handleAISearch}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <SparklesIcon className="h-5 w-5" />
              AI Search
            </button>
          </div>
        </div>
      )}
    </div>
  );
}