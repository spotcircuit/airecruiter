'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  DocumentArrowUpIcon,
  SparklesIcon,
  UserPlusIcon,
  FunnelIcon,
  MapPinIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';
import { ResumeParser } from '@/components/resume-parser';
import { CSVImporter } from '@/components/csv-importer';

interface Candidate {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  current_title?: string;
  current_company?: string;
  location?: string;
  years_experience?: number;
  skills?: string[];
  linkedin_url?: string;
  github_url?: string;
  created_at: string;
  similarity_score?: number;
}

export default function CandidatesPageDB() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  const [showResumeParser, setShowResumeParser] = useState(false);
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [filters, setFilters] = useState({
    skills: [] as string[],
    yearsExperience: null as number | null,
    location: ''
  });

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/candidates');
      const data = await response.json();
      setCandidates(data.candidates || []);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery && filters.skills.length === 0 && !filters.location && !filters.yearsExperience) {
      fetchCandidates();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/candidates/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: searchQuery,
          skills: filters.skills,
          yearsExperience: filters.yearsExperience,
          location: filters.location,
          useSemanticSearch,
          limit: 50
        })
      });
      
      const data = await response.json();
      setCandidates(data.candidates || []);
    } catch (error) {
      console.error('Error searching candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeParsed = async (parsedData: any) => {
    // Create new candidate from parsed resume
    const newCandidate = {
      first_name: parsedData.firstName,
      last_name: parsedData.lastName,
      email: parsedData.email,
      phone: parsedData.phone,
      current_title: parsedData.currentTitle,
      current_company: parsedData.currentCompany,
      location: parsedData.location,
      years_experience: parsedData.yearsExperience,
      skills: parsedData.skills,
      linkedin_url: parsedData.linkedinUrl,
      github_url: parsedData.githubUrl,
      notes: parsedData.summary
    };

    try {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCandidate)
      });
      
      if (response.ok) {
        setShowResumeParser(false);
        fetchCandidates();
      }
    } catch (error) {
      console.error('Error saving candidate:', error);
    }
  };

  const handleCSVImport = async (data: any[]) => {
    try {
      const response = await fetch('/api/candidates/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ candidates: data })
      });
      
      if (response.ok) {
        fetchCandidates();
      }
    } catch (error) {
      console.error('Error importing candidates:', error);
      throw error;
    }
  };

  const addSkillFilter = (skill: string) => {
    if (!filters.skills.includes(skill)) {
      setFilters({ ...filters, skills: [...filters.skills, skill] });
    }
  };

  const removeSkillFilter = (skill: string) => {
    setFilters({ ...filters, skills: filters.skills.filter(s => s !== skill) });
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-700';
    if (score >= 0.8) return 'bg-green-100 text-green-700';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-4xl font-bold">Candidate Database</h1>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResumeParser(true)}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2"
              >
                <DocumentArrowUpIcon className="h-5 w-5" />
                Parse Resume
              </button>
              <button
                onClick={() => setShowCSVImporter(true)}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all flex items-center gap-2"
              >
                <UserPlusIcon className="h-5 w-5" />
                Import CSV
              </button>
            </div>
          </div>
          <p className="text-purple-100 mb-8 text-xl max-w-3xl">
            Search and manage your candidate pipeline with AI-powered matching
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search by name, skills, or job title..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>
              <button
                onClick={() => setUseSemanticSearch(!useSemanticSearch)}
                className={`px-4 py-3 rounded-lg transition-all flex items-center gap-2 ${
                  useSemanticSearch 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <SparklesIcon className="h-5 w-5" />
                AI Search
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
              >
                Search
              </button>
            </div>

            {/* Filters */}
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">Filters:</span>
              </div>
              
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4 text-gray-500" />
                <input
                  type="number"
                  placeholder="Min years exp"
                  value={filters.yearsExperience || ''}
                  onChange={(e) => setFilters({ ...filters, yearsExperience: parseInt(e.target.value) || null })}
                  className="px-3 py-1 border border-gray-300 rounded text-sm w-32 text-gray-900"
                />
              </div>

              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Location"
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="px-3 py-1 border border-gray-300 rounded text-sm w-32 text-gray-900"
                />
              </div>

              {filters.skills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm flex items-center gap-1">
                  {skill}
                  <button onClick={() => removeSkillFilter(skill)} className="text-purple-500 hover:text-purple-700">
                    ×
                  </button>
                </span>
              ))}
            </div>

            {useSemanticSearch && (
              <div className="mt-3 bg-purple-50 p-3 rounded-lg">
                <p className="text-sm text-purple-700">
                  <SparklesIcon className="inline h-4 w-4 mr-1" />
                  AI-powered semantic search uses embeddings to find candidates with similar experience and skills
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : candidates.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <UserPlusIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
            <p className="text-gray-500">Try adjusting your search filters or import candidates</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Found {candidates.length} candidates
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-medium text-gray-900">
                          {candidate.first_name} {candidate.last_name}
                        </h3>
                        {candidate.similarity_score !== undefined && (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(candidate.similarity_score)}`}>
                            {Math.round(candidate.similarity_score * 100)}% match
                          </span>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        {candidate.current_title && (
                          <p>{candidate.current_title} {candidate.current_company && `at ${candidate.current_company}`}</p>
                        )}
                        {candidate.location && (
                          <p className="flex items-center gap-1">
                            <MapPinIcon className="h-4 w-4" />
                            {candidate.location}
                          </p>
                        )}
                        {candidate.years_experience !== undefined && (
                          <p>{candidate.years_experience} years of experience</p>
                        )}
                      </div>

                      {candidate.skills && candidate.skills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {candidate.skills.slice(0, 6).map((skill, index) => (
                            <button
                              key={index}
                              onClick={() => addSkillFilter(skill)}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                            >
                              {skill}
                            </button>
                          ))}
                          {candidate.skills.length > 6 && (
                            <span className="px-2 py-1 text-gray-500 text-xs">
                              +{candidate.skills.length - 6} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 ml-4">
                      <a
                        href={`mailto:${candidate.email}`}
                        className="px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      >
                        Contact
                      </a>
                      {candidate.linkedin_url && (
                        <a
                          href={candidate.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                          LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Resume Parser Modal */}
      {showResumeParser && (
        <ResumeParser
          onParsed={handleResumeParsed}
          onClose={() => setShowResumeParser(false)}
        />
      )}

      {/* CSV Importer Modal */}
      {showCSVImporter && (
        <CSVImporter
          type="candidates"
          onImport={handleCSVImport}
          onClose={() => setShowCSVImporter(false)}
        />
      )}
    </div>
  );
}