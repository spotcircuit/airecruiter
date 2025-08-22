'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  DocumentArrowUpIcon,
  SparklesIcon,
  UserPlusIcon,
  FunnelIcon,
  MapPinIcon,
  BriefcaseIcon,
  ViewColumnsIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline';
import { ResumeParser } from '@/components/resume-parser';
import { CSVImporter } from '@/components/csv-importer';
import { CandidateDetailsModal } from './_components/candidate-details-modal';
import { CandidateSearchBuilder } from './_components/candidate-search-builder';
import { CandidateICPBuilder } from './_components/candidate-icp-builder';
import { CandidatePipeline } from './_components/candidate-pipeline';
import { SmartMatcher } from '@/components/smart-matcher';
import { CandidateMatchCard } from '@/components/candidate-match-card';

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
  // Extended fields for modal
  experience?: any[];
  education?: any[];
  certifications?: any[];
  languages?: string[];
  availability?: string;
  salary_expectations?: { min: number; max: number };
  notes?: string;
  tags?: string[];
  source?: string;
  status?: string;
}

type TabType = 'list' | 'pipeline' | 'search' | 'icp' | 'matcher';

export default function CandidatesPageEnhanced() {
  const [activeTab, setActiveTab] = useState<TabType>('list');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [useSemanticSearch, setUseSemanticSearch] = useState(false);
  const [showResumeParser, setShowResumeParser] = useState(false);
  const [showCSVImporter, setShowCSVImporter] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
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
      // Mock data for demonstration
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          first_name: 'Sarah',
          last_name: 'Chen',
          email: 'sarah.chen@email.com',
          phone: '+1 415 555 0123',
          current_title: 'Senior Frontend Developer',
          current_company: 'TechCorp',
          location: 'San Francisco, CA',
          years_experience: 5,
          skills: ['React', 'TypeScript', 'Node.js', 'GraphQL', 'AWS'],
          linkedin_url: 'https://linkedin.com/in/sarahchen',
          github_url: 'https://github.com/sarahchen',
          created_at: new Date().toISOString(),
          similarity_score: 0.92,
          experience: [
            {
              title: 'Senior Frontend Developer',
              company: 'TechCorp',
              duration: '2021 - Present',
              description: 'Leading frontend development for enterprise SaaS platform'
            },
            {
              title: 'Frontend Developer',
              company: 'StartupXYZ',
              duration: '2019 - 2021',
              description: 'Built React-based applications for e-commerce'
            }
          ],
          education: [
            {
              degree: 'BS Computer Science',
              school: 'UC Berkeley',
              year: '2019'
            }
          ],
          salary_expectations: { min: 140000, max: 160000 },
          availability: 'immediate',
          status: 'active'
        },
        {
          id: '2',
          first_name: 'Michael',
          last_name: 'Rodriguez',
          email: 'michael.r@email.com',
          phone: '+1 512 555 0456',
          current_title: 'Full Stack Engineer',
          current_company: 'StartupABC',
          location: 'Austin, TX',
          years_experience: 4,
          skills: ['React', 'Python', 'Django', 'PostgreSQL', 'Docker'],
          linkedin_url: 'https://linkedin.com/in/michaelrodriguez',
          created_at: new Date().toISOString(),
          similarity_score: 0.85,
          status: 'active'
        },
        {
          id: '3',
          first_name: 'Emily',
          last_name: 'Johnson',
          email: 'emily.j@email.com',
          current_title: 'React Developer',
          current_company: 'Digital Agency',
          location: 'New York, NY',
          years_experience: 3,
          skills: ['React', 'JavaScript', 'CSS', 'Jest', 'Redux'],
          created_at: new Date().toISOString(),
          similarity_score: 0.78,
          status: 'active'
        }
      ];
      setCandidates(mockCandidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery && filters.skills.length === 0 && !filters.location && !filters.yearsExperience) {
      fetchCandidates();
      return;
    }

    // TODO: Implement actual search
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const handleResumeParsed = async (parsedData: any) => {
    // Create new candidate from parsed resume
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      first_name: parsedData.firstName || '',
      last_name: parsedData.lastName || '',
      email: parsedData.email || '',
      phone: parsedData.phone,
      current_title: parsedData.currentTitle,
      current_company: parsedData.currentCompany,
      location: parsedData.location,
      years_experience: parsedData.yearsExperience,
      skills: parsedData.skills || [],
      linkedin_url: parsedData.linkedinUrl,
      github_url: parsedData.githubUrl,
      notes: parsedData.summary,
      created_at: new Date().toISOString(),
      status: 'new'
    };

    // Add to candidates list
    setCandidates(prev => [newCandidate, ...prev]);
    setShowResumeParser(false);
    
    // Open the candidate modal to complete their profile
    setSelectedCandidate(newCandidate);
  };

  const handleCSVImport = async (data: any[]) => {
    // TODO: Implement CSV import
    console.log('Importing candidates:', data);
    setShowCSVImporter(false);
    fetchCandidates();
  };

  const handleCandidateUpdate = (updatedCandidate: Candidate) => {
    setCandidates(prev => 
      prev.map(c => c.id === updatedCandidate.id ? updatedCandidate : c)
    );
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

  const tabs = [
    { key: 'list' as TabType, label: 'All Candidates', icon: UsersIcon },
    { key: 'pipeline' as TabType, label: 'Pipeline', icon: ViewColumnsIcon },
    { key: 'search' as TabType, label: 'Advanced Search', icon: MagnifyingGlassIcon },
    { key: 'icp' as TabType, label: 'Ideal Profiles', icon: ClipboardDocumentListIcon },
    { key: 'matcher' as TabType, label: 'Smart Matcher', icon: SparklesIcon }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="pl-1 pr-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold">Talent Pipeline</h1>
            </div>
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

          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 rounded-t-lg flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === tab.key
                      ? 'bg-white text-purple-600'
                      : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pl-1 pr-4 py-6">
        {activeTab === 'list' && (
          <>
            {/* Quick Search Bar */}
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-sm p-3">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Search candidates by name, skills, or title..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                    />
                  </div>
                  <button
                    onClick={() => setUseSemanticSearch(!useSemanticSearch)}
                    className={`px-3 py-2 rounded-lg transition-all flex items-center gap-2 text-sm ${
                      useSemanticSearch 
                        ? 'bg-purple-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <SparklesIcon className="h-4 w-4" />
                    AI Search
                  </button>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all text-sm"
                  >
                    Search
                  </button>
                </div>

                {/* Quick Filters */}
                {filters.skills.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {filters.skills.map(skill => (
                      <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs flex items-center gap-1">
                        {skill}
                        <button onClick={() => removeSkillFilter(skill)} className="text-purple-500 hover:text-purple-700">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Candidates List */}
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : candidates.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <UserPlusIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No candidates found</h3>
                <p className="text-gray-500">Import candidates or adjust your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {candidates.map((candidate) => (
                  <CandidateMatchCard
                    key={candidate.id}
                    candidateId={candidate.id}
                    candidateName={`${candidate.first_name} ${candidate.last_name}`}
                    candidateTitle={candidate.current_title}
                    candidateLocation={candidate.location}
                    matchScore={Math.round((candidate.similarity_score || 0.75) * 100)}
                    skills={candidate.skills}
                    experience={candidate.years_experience}
                    expectedSalary={candidate.salary_expectations}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'pipeline' && (
          <CandidatePipeline 
            onCandidateClick={(candidate: any) => {
              // Convert pipeline candidate to our format
              const fullCandidate: Candidate = {
                ...candidate,
                first_name: candidate.name?.split(' ')[0] || '',
                last_name: candidate.name?.split(' ').slice(1).join(' ') || ''
              };
              setSelectedCandidate(fullCandidate);
            }}
          />
        )}

        {activeTab === 'search' && (
          <CandidateSearchBuilder 
            onSearch={(searchConfig) => {
              console.log('Search config:', searchConfig);
              // TODO: Implement search
            }}
          />
        )}

        {activeTab === 'icp' && (
          <CandidateICPBuilder 
            onSave={(icp) => {
              console.log('Saved ICP:', icp);
              // TODO: Implement ICP save
            }}
          />
        )}

        {activeTab === 'matcher' && (
          <SmartMatcher />
        )}
      </div>

      {/* Candidate Details Modal */}
      {selectedCandidate && (
        <CandidateDetailsModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onUpdate={handleCandidateUpdate}
          onAddToProject={(projectId) => {
            console.log('Add to project:', projectId);
            // TODO: Implement add to project
          }}
          onStartOutreach={() => {
            console.log('Start outreach for:', selectedCandidate.id);
            // TODO: Implement outreach
          }}
        />
      )}

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