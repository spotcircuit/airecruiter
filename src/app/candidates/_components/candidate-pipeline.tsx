'use client';

import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  PhoneIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  XMarkIcon,
  ChevronRightIcon,
  BriefcaseIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

type CandidateStage = 'sourced' | 'contacted' | 'screening' | 'submitted' | 'interviewing' | 'offer' | 'hired' | 'rejected';

interface Candidate {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  location?: string;
  skills: string[];
  experience_years?: number;
  salary_expectations?: { min: number; max: number };
  stage: CandidateStage;
  rating?: number;
  notes?: string;
  next_action?: string;
  project_id?: string;
  project_name?: string;
  source?: string;
  contacted_at?: string;
  submitted_at?: string;
  updated_at: string;
  created_at: string;
  match_score?: number;
}

interface Project {
  id: string;
  name: string;
  client?: string;
  status: 'active' | 'on_hold' | 'closed';
}

const stages: { key: CandidateStage; label: string; color: string; bgColor: string }[] = [
  { key: 'sourced', label: 'Sourced', color: 'text-gray-700', bgColor: 'bg-gray-50' },
  { key: 'contacted', label: 'Contacted', color: 'text-blue-700', bgColor: 'bg-blue-50' },
  { key: 'screening', label: 'Screening', color: 'text-purple-700', bgColor: 'bg-purple-50' },
  { key: 'submitted', label: 'Submitted', color: 'text-indigo-700', bgColor: 'bg-indigo-50' },
  { key: 'interviewing', label: 'Interviewing', color: 'text-yellow-700', bgColor: 'bg-yellow-50' },
  { key: 'offer', label: 'Offer', color: 'text-green-700', bgColor: 'bg-green-50' },
  { key: 'hired', label: 'Hired', color: 'text-emerald-700', bgColor: 'bg-emerald-50' },
  { key: 'rejected', label: 'Rejected', color: 'text-red-700', bgColor: 'bg-red-50' }
];

interface CandidatePipelineProps {
  projectId?: string;
  onCandidateClick?: (candidate: Candidate) => void;
}

export function CandidatePipeline({ projectId, onCandidateClick }: CandidatePipelineProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedCandidate, setDraggedCandidate] = useState<Candidate | null>(null);
  const [dragOverStage, setDragOverStage] = useState<CandidateStage | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>(projectId || 'all');
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [newCandidateForm, setNewCandidateForm] = useState({
    name: '',
    email: '',
    phone: '',
    title: '',
    company: '',
    location: '',
    experience_years: '',
    skills: '',
    project_id: projectId || '',
    notes: ''
  });

  useEffect(() => {
    fetchCandidates();
    fetchProjects();
  }, []);

  const fetchCandidates = async () => {
    try {
      // Mock data for now
      const mockCandidates: Candidate[] = [
        {
          id: '1',
          name: 'Sarah Chen',
          email: 'sarah.chen@email.com',
          title: 'Senior Frontend Developer',
          company: 'TechCorp',
          location: 'San Francisco, CA',
          skills: ['React', 'TypeScript', 'Node.js'],
          experience_years: 5,
          salary_expectations: { min: 140000, max: 160000 },
          stage: 'screening',
          rating: 4,
          match_score: 92,
          project_name: 'Frontend Lead - Series B Startup',
          next_action: 'Technical interview scheduled',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Michael Rodriguez',
          email: 'michael.r@email.com',
          title: 'Full Stack Engineer',
          company: 'StartupXYZ',
          location: 'Austin, TX',
          skills: ['React', 'Python', 'AWS'],
          experience_years: 4,
          salary_expectations: { min: 120000, max: 140000 },
          stage: 'contacted',
          rating: 3,
          match_score: 85,
          project_name: 'Frontend Lead - Series B Startup',
          next_action: 'Waiting for response',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Emily Johnson',
          email: 'emily.j@email.com',
          title: 'React Developer',
          company: 'DigitalAgency',
          location: 'New York, NY',
          skills: ['React', 'JavaScript', 'CSS'],
          experience_years: 3,
          stage: 'submitted',
          rating: 4,
          match_score: 78,
          project_name: 'E-commerce Platform',
          next_action: 'Client reviewing resume',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'David Kim',
          email: 'david.kim@email.com',
          title: 'Senior Software Engineer',
          company: 'BigTech Inc',
          location: 'Seattle, WA',
          skills: ['Java', 'Spring', 'Kubernetes'],
          experience_years: 7,
          salary_expectations: { min: 180000, max: 200000 },
          stage: 'interviewing',
          rating: 5,
          match_score: 95,
          project_name: 'Backend Architect - Fintech',
          next_action: 'Final round next week',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Lisa Wang',
          email: 'lisa.w@email.com',
          title: 'DevOps Engineer',
          company: 'CloudFirst',
          location: 'Remote',
          skills: ['AWS', 'Docker', 'Terraform'],
          experience_years: 6,
          stage: 'offer',
          rating: 5,
          match_score: 88,
          project_name: 'DevOps Lead - Scale-up',
          next_action: 'Negotiating compensation',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Robert Taylor',
          email: 'robert.t@email.com',
          title: 'Backend Developer',
          company: 'SaaS Startup',
          location: 'Boston, MA',
          skills: ['Python', 'Django', 'PostgreSQL'],
          experience_years: 4,
          stage: 'sourced',
          rating: 3,
          match_score: 82,
          next_action: 'Send initial outreach',
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString()
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

  const fetchProjects = async () => {
    try {
      // Mock data
      const mockProjects: Project[] = [
        { id: '1', name: 'Frontend Lead - Series B Startup', client: 'TechVentures', status: 'active' },
        { id: '2', name: 'E-commerce Platform', client: 'RetailCo', status: 'active' },
        { id: '3', name: 'Backend Architect - Fintech', client: 'FinanceApp', status: 'active' },
        { id: '4', name: 'DevOps Lead - Scale-up', client: 'CloudScale', status: 'active' }
      ];
      setProjects(mockProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, candidate: Candidate) => {
    setDraggedCandidate(candidate);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: CandidateStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, newStage: CandidateStage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (!draggedCandidate || draggedCandidate.stage === newStage) return;
    
    // Optimistically update UI
    setCandidates(prevCandidates => 
      prevCandidates.map(candidate => 
        candidate.id === draggedCandidate.id 
          ? { ...candidate, stage: newStage, updated_at: new Date().toISOString() }
          : candidate
      )
    );
    
    // TODO: Update in database
    setDraggedCandidate(null);
  };

  const getCandidatesByStage = (stage: CandidateStage) => {
    let filtered = candidates.filter(c => c.stage === stage);
    
    if (selectedProject !== 'all') {
      filtered = filtered.filter(c => c.project_id === selectedProject);
    }
    
    return filtered;
  };

  const getStageCount = (stage: CandidateStage) => {
    return getCandidatesByStage(stage).length;
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarSolidIcon key={star} className="h-3 w-3 text-yellow-500" />
          ) : (
            <StarIcon key={star} className="h-3 w-3 text-gray-300" />
          )
        ))}
      </div>
    );
  };

  const formatSalary = (salary?: { min: number; max: number }) => {
    if (!salary) return null;
    return `$${(salary.min / 1000).toFixed(0)}k-${(salary.max / 1000).toFixed(0)}k`;
  };

  const handleAddCandidate = async () => {
    // TODO: Implement API call
    const newCandidate: Candidate = {
      id: Date.now().toString(),
      name: newCandidateForm.name,
      email: newCandidateForm.email,
      phone: newCandidateForm.phone,
      title: newCandidateForm.title,
      company: newCandidateForm.company,
      location: newCandidateForm.location,
      experience_years: newCandidateForm.experience_years ? parseInt(newCandidateForm.experience_years) : undefined,
      skills: newCandidateForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      stage: 'sourced',
      project_id: newCandidateForm.project_id,
      notes: newCandidateForm.notes,
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    };
    
    setCandidates(prev => [...prev, newCandidate]);
    setShowAddCandidate(false);
    setNewCandidateForm({
      name: '',
      email: '',
      phone: '',
      title: '',
      company: '',
      location: '',
      experience_years: '',
      skills: '',
      project_id: projectId || '',
      notes: ''
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header with filters */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Projects</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <UserIcon className="h-4 w-4" />
            <span>{candidates.length} total candidates</span>
          </div>
        </div>
        
        <button
          onClick={() => setShowAddCandidate(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <PlusIcon className="h-4 w-4" />
          Add Candidate
        </button>
      </div>

      {/* Pipeline stages */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {stages.map((stage) => {
          const stageCandidates = getCandidatesByStage(stage.key);
          const isDropTarget = dragOverStage === stage.key;
          
          return (
            <div
              key={stage.key}
              className={`flex-shrink-0 w-80 ${stage.bgColor} rounded-lg p-4 ${
                isDropTarget ? 'ring-2 ring-blue-500' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`font-semibold ${stage.color}`}>{stage.label}</h3>
                  <span className={`${stage.bgColor} ${stage.color} px-2 py-0.5 rounded-full text-sm font-medium border`}>
                    {stageCandidates.length}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                {stageCandidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, candidate)}
                    onClick={() => onCandidateClick?.(candidate)}
                    className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{candidate.name}</h4>
                        {candidate.title && (
                          <p className="text-xs text-gray-600 mt-0.5">{candidate.title}</p>
                        )}
                      </div>
                      {candidate.match_score && (
                        <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          {candidate.match_score}% match
                        </span>
                      )}
                    </div>
                    
                    {renderRating(candidate.rating)}
                    
                    <div className="mt-3 space-y-1.5">
                      {candidate.company && (
                        <div className="flex items-center text-xs text-gray-600">
                          <BuildingOfficeIcon className="h-3 w-3 mr-1.5 text-gray-400" />
                          <span className="truncate">{candidate.company}</span>
                        </div>
                      )}
                      
                      {candidate.location && (
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPinIcon className="h-3 w-3 mr-1.5 text-gray-400" />
                          <span className="truncate">{candidate.location}</span>
                        </div>
                      )}
                      
                      {candidate.experience_years && (
                        <div className="flex items-center text-xs text-gray-600">
                          <BriefcaseIcon className="h-3 w-3 mr-1.5 text-gray-400" />
                          <span>{candidate.experience_years} years exp</span>
                        </div>
                      )}
                      
                      {candidate.salary_expectations && (
                        <div className="flex items-center text-xs text-gray-600">
                          <CurrencyDollarIcon className="h-3 w-3 mr-1.5 text-gray-400" />
                          <span>{formatSalary(candidate.salary_expectations)}</span>
                        </div>
                      )}
                    </div>
                    
                    {candidate.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {candidate.skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs">
                            {skill}
                          </span>
                        ))}
                        {candidate.skills.length > 3 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-xs">
                            +{candidate.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {candidate.project_name && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">{candidate.project_name}</p>
                      </div>
                    )}
                    
                    {candidate.next_action && (
                      <div className="mt-2 flex items-start text-xs text-blue-600">
                        <ChevronRightIcon className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{candidate.next_action}</span>
                      </div>
                    )}
                    
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        <span>{new Date(candidate.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {stage.key === 'sourced' && stageCandidates.length === 0 && (
                  <button
                    onClick={() => setShowAddCandidate(true)}
                    className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Candidate
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Candidate Modal */}
      {showAddCandidate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Candidate</h3>
              <button
                onClick={() => setShowAddCandidate(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={newCandidateForm.name}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newCandidateForm.email}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="john@example.com"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newCandidateForm.phone}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 234 567 8900"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Title
                </label>
                <input
                  type="text"
                  value={newCandidateForm.title}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Senior Software Engineer"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={newCandidateForm.company}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, company: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="TechCorp"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={newCandidateForm.location}
                    onChange={(e) => setNewCandidateForm({ ...newCandidateForm, location: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  value={newCandidateForm.experience_years}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, experience_years: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  value={newCandidateForm.skills}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, skills: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="React, TypeScript, Node.js"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project
                </label>
                <select
                  value={newCandidateForm.project_id}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, project_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">No project</option>
                  {projects.map(project => (
                    <option key={project.id} value={project.id}>{project.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newCandidateForm.notes}
                  onChange={(e) => setNewCandidateForm({ ...newCandidateForm, notes: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional notes about the candidate..."
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddCandidate(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCandidate}
                disabled={!newCandidateForm.name}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Add Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}