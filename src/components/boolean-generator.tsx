'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface BooleanGeneratorProps {
  jobTitle?: string;
  jobDescription?: string;
  requirements?: string[];
  niceToHaves?: string[];
}

export function BooleanGenerator({ 
  jobTitle = '', 
  jobDescription = '', 
  requirements = [], 
  niceToHaves = [] 
}: BooleanGeneratorProps) {
  const [queries, setQueries] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [copiedQuery, setCopiedQuery] = useState<string | null>(null);
  const [customRequirements, setCustomRequirements] = useState(requirements.join(', '));
  const [customNiceToHaves, setCustomNiceToHaves] = useState(niceToHaves.join(', '));
  const [excludeTerms, setExcludeTerms] = useState('');
  const [locations, setLocations] = useState('');

  const generateBoolean = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-boolean', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jd_text: jobDescription,
          requirements: customRequirements.split(',').map(s => s.trim()).filter(Boolean),
          nice_to_haves: customNiceToHaves.split(',').map(s => s.trim()).filter(Boolean),
          exclude: excludeTerms.split(',').map(s => s.trim()).filter(Boolean),
          locations: locations.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });

      const data = await response.json();
      setQueries(data.queries || {});
    } catch (error) {
      console.error('Error generating Boolean query:', error);
      // Fallback to client-side generation
      generateFallbackQueries();
    } finally {
      setLoading(false);
    }
  };

  const generateFallbackQueries = () => {
    const mustTerms = customRequirements.split(',').map(s => s.trim()).filter(Boolean);
    const bonusTerms = customNiceToHaves.split(',').map(s => s.trim()).filter(Boolean);
    const excludeList = excludeTerms.split(',').map(s => s.trim()).filter(Boolean);
    const locationList = locations.split(',').map(s => s.trim()).filter(Boolean);

    const linkedIn = generateLinkedInQuery(mustTerms, bonusTerms, excludeList, locationList);
    const google = generateGoogleQuery(mustTerms, bonusTerms, excludeList, locationList);
    const indeed = generateIndeedQuery(mustTerms, bonusTerms, excludeList);

    setQueries({ linkedin: linkedIn, google, indeed });
  };

  const generateLinkedInQuery = (must: string[], bonus: string[], exclude: string[], locs: string[]) => {
    let query = '';
    if (must.length > 0) query += must.map(t => `"${t}"`).join(' AND ');
    if (bonus.length > 0) query += ` AND (${bonus.map(t => `"${t}"`).join(' OR ')})`;
    if (exclude.length > 0) query += ` NOT (${exclude.map(t => `"${t}"`).join(' OR ')})`;
    if (locs.length > 0) query += ` AND (${locs.map(l => `"${l}"`).join(' OR ')})`;
    return query || 'Add requirements to generate query';
  };

  const generateGoogleQuery = (must: string[], bonus: string[], exclude: string[], locs: string[]) => {
    let query = 'site:linkedin.com/in OR site:github.com';
    if (must.length > 0) query += ' ' + must.map(t => `"${t}"`).join(' ');
    if (bonus.length > 0) query += ` (${bonus.map(t => `"${t}"`).join(' OR ')})`;
    exclude.forEach(t => { query += ` -"${t}"`; });
    if (locs.length > 0) query += ` (${locs.map(l => `"${l}"`).join(' OR ')})`;
    return query;
  };

  const generateIndeedQuery = (must: string[], bonus: string[], exclude: string[]) => {
    let query = 'resume';
    if (must.length > 0) query += ' ' + must.map(t => `"${t}"`).join(' ');
    if (bonus.length > 0) query += ` (${bonus.join(' OR ')})`;
    exclude.forEach(t => { query += ` NOT ${t}`; });
    return query;
  };

  const copyToClipboard = async (text: string, platform: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedQuery(platform);
    setTimeout(() => setCopiedQuery(null), 2000);
  };

  const openInPlatform = (query: string, platform: string) => {
    const urls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`,
      google: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      indeed: `https://www.indeed.com/resumes?q=${encodeURIComponent(query)}`,
      github: `https://github.com/search?q=${encodeURIComponent(query)}&type=users`,
    };
    
    if (urls[platform]) {
      window.open(urls[platform], '_blank');
    }
  };

  const platforms = [
    { key: 'linkedin', name: 'LinkedIn', color: 'bg-blue-600' },
    { key: 'google', name: 'Google', color: 'bg-green-600' },
    { key: 'indeed', name: 'Indeed', color: 'bg-indigo-600' },
    { key: 'github', name: 'GitHub', color: 'bg-gray-800' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Boolean Query Generator</h3>
        <p className="text-sm text-gray-600">
          Generate optimized search queries for different platforms to find the best candidates
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Must-Have Skills (comma-separated)
          </label>
          <input
            type="text"
            value={customRequirements}
            onChange={(e) => setCustomRequirements(e.target.value)}
            placeholder="e.g., React, Node.js, 5+ years experience"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nice-to-Have Skills (comma-separated)
          </label>
          <input
            type="text"
            value={customNiceToHaves}
            onChange={(e) => setCustomNiceToHaves(e.target.value)}
            placeholder="e.g., AWS, Docker, Machine Learning"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Exclude Terms (comma-separated)
          </label>
          <input
            type="text"
            value={excludeTerms}
            onChange={(e) => setExcludeTerms(e.target.value)}
            placeholder="e.g., junior, intern, entry-level"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Locations (comma-separated)
          </label>
          <input
            type="text"
            value={locations}
            onChange={(e) => setLocations(e.target.value)}
            placeholder="e.g., San Francisco, New York, Remote"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={generateBoolean}
          disabled={loading}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating...
            </>
          ) : (
            <>
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Generate Boolean Queries
            </>
          )}
        </button>
      </div>

      {Object.keys(queries).length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="text-sm font-semibold text-gray-900">Generated Queries:</h4>
          
          {platforms.map((platform) => {
            const query = queries[platform.key];
            if (!query) return null;
            
            return (
              <div key={platform.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${platform.color}`}>
                    {platform.name}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyToClipboard(query, platform.key)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                    >
                      {copiedQuery === platform.key ? (
                        <>
                          <CheckIcon className="h-3 w-3 mr-1 text-green-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => openInPlatform(query, platform.key)}
                      className="inline-flex items-center px-2 py-1 text-xs font-medium text-white bg-blue-600 border border-transparent rounded hover:bg-blue-700"
                    >
                      Search →
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded p-2 text-xs font-mono text-gray-700 break-all">
                  {query}
                </div>
              </div>
            );
          })}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h5 className="text-xs font-semibold text-blue-900 mb-1">Pro Tips:</h5>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Use quotation marks for exact phrases</li>
              <li>• Adjust terms based on initial results</li>
              <li>• Try different combinations of must-have and nice-to-have skills</li>
              <li>• Consider using industry-specific synonyms</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}