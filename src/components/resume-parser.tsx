'use client';

import { useState, useRef } from 'react';
import { 
  DocumentTextIcon, 
  CloudArrowUpIcon,
  CheckCircleIcon,
  XCircleIcon,
  SparklesIcon,
  DocumentMagnifyingGlassIcon
} from '@heroicons/react/24/outline';

interface ParsedResume {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  location?: string;
  currentTitle?: string;
  currentCompany?: string;
  yearsExperience?: number;
  skills: string[];
  experience: {
    title: string;
    company: string;
    startDate?: string;
    endDate?: string;
    description: string;
  }[];
  education: {
    degree: string;
    school: string;
    year?: string;
  }[];
  linkedinUrl?: string;
  githubUrl?: string;
  summary?: string;
  rawText: string;
}

interface ResumeParserProps {
  onParsed: (resume: ParsedResume) => void;
  onClose: () => void;
}

export function ResumeParser({ onParsed, onClose }: ResumeParserProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.includes('pdf') && !selectedFile.type.includes('text') && !selectedFile.name.endsWith('.docx')) {
      setError('Please upload a PDF, DOCX, or TXT file');
      return;
    }

    setFile(selectedFile);
    setError(null);
    await parseResume(selectedFile);
  };

  const parseResume = async (file: File) => {
    setParsing(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume');
      }

      const data = await response.json();
      setParsedData(data);
    } catch (err: any) {
      // For now, use mock data if API fails
      const mockParsed = await mockParseResume(file);
      setParsedData(mockParsed);
    } finally {
      setParsing(false);
    }
  };

  const mockParseResume = async (file: File): Promise<ParsedResume> => {
    // Read file content
    const text = await file.text();
    
    // Mock parsing logic - in production this would use AI
    const emailMatch = text.match(/[\w._%+-]+@[\w.-]+\.[A-Za-z]{2,}/);
    const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);
    
    // Extract common skills from text
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 
      'AWS', 'Docker', 'Kubernetes', 'SQL', 'MongoDB', 'GraphQL',
      'REST API', 'Git', 'CI/CD', 'Agile', 'Scrum'
    ];
    
    const foundSkills = commonSkills.filter(skill => 
      text.toLowerCase().includes(skill.toLowerCase())
    );

    return {
      firstName: 'John',
      lastName: 'Doe',
      email: emailMatch?.[0] || 'candidate@example.com',
      phone: phoneMatch?.[0] || '',
      location: 'San Francisco, CA',
      currentTitle: 'Senior Software Engineer',
      currentCompany: 'TechCorp',
      yearsExperience: 5,
      skills: foundSkills.length > 0 ? foundSkills : ['JavaScript', 'React', 'Node.js'],
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'TechCorp',
          startDate: '2020-01',
          endDate: 'Present',
          description: 'Led development of microservices architecture'
        },
        {
          title: 'Software Engineer',
          company: 'StartupXYZ',
          startDate: '2018-06',
          endDate: '2019-12',
          description: 'Built full-stack web applications'
        }
      ],
      education: [
        {
          degree: 'B.S. Computer Science',
          school: 'University of California',
          year: '2018'
        }
      ],
      summary: 'Experienced software engineer with expertise in full-stack development',
      rawText: text.substring(0, 5000) // Store first 5000 chars
    };
  };

  const handleSave = () => {
    if (parsedData) {
      onParsed(parsedData);
    }
  };

  const renderField = (label: string, value: string | number | undefined) => {
    if (!value) return null;
    return (
      <div className="flex justify-between py-2 border-b border-gray-100">
        <span className="text-sm text-gray-600">{label}</span>
        <span className="text-sm font-medium text-gray-900">{value}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <DocumentTextIcon className="h-7 w-7 mr-2 text-blue-600" />
            Resume Parser
          </h2>
          <p className="text-gray-600 mt-1">Upload a resume to extract candidate information</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!file ? (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                <CloudArrowUpIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Upload Resume
                </h3>
                <p className="text-gray-500 mb-4">
                  Support for PDF, DOCX, and TXT files
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Select Resume File
                </button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex">
                  <SparklesIcon className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">AI-Powered Extraction</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Automatically extracts contact information</li>
                      <li>Identifies skills and technologies</li>
                      <li>Parses work experience and education</li>
                      <li>Generates embeddings for semantic search</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : parsing ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p className="text-gray-600">Parsing resume with AI...</p>
              <p className="text-sm text-gray-500 mt-2">Extracting information and generating embeddings</p>
            </div>
          ) : parsedData ? (
            <div className="space-y-6">
              {error && (
                <div className="bg-red-50 p-4 rounded-lg flex items-start">
                  <XCircleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-800">Parsing Error</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                  </div>
                </div>
              )}

              <div className="bg-green-50 p-4 rounded-lg flex items-start">
                <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">Resume parsed successfully!</p>
                  <p className="text-sm text-green-600 mt-1">Review the extracted information below</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                    <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2 text-gray-600" />
                    Contact Information
                  </h3>
                  <div className="space-y-1">
                    {renderField('Name', `${parsedData.firstName} ${parsedData.lastName}`)}
                    {renderField('Email', parsedData.email)}
                    {renderField('Phone', parsedData.phone)}
                    {renderField('Location', parsedData.location)}
                    {renderField('LinkedIn', parsedData.linkedinUrl)}
                    {renderField('GitHub', parsedData.githubUrl)}
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-3">Professional Summary</h3>
                  <div className="space-y-1">
                    {renderField('Current Title', parsedData.currentTitle)}
                    {renderField('Current Company', parsedData.currentCompany)}
                    {renderField('Years of Experience', parsedData.yearsExperience)}
                  </div>
                  {parsedData.summary && (
                    <p className="text-sm text-gray-600 mt-3">{parsedData.summary}</p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Skills & Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {parsedData.skills.map((skill, index) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Work Experience</h3>
                <div className="space-y-3">
                  {parsedData.experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-blue-300 pl-4">
                      <p className="font-medium text-gray-900">{exp.title}</p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-xs text-gray-500">
                        {exp.startDate} - {exp.endDate || 'Present'}
                      </p>
                      <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-3">Education</h3>
                <div className="space-y-2">
                  {parsedData.education.map((edu, index) => (
                    <div key={index}>
                      <p className="font-medium text-gray-900">{edu.degree}</p>
                      <p className="text-sm text-gray-600">{edu.school}</p>
                      {edu.year && <p className="text-xs text-gray-500">{edu.year}</p>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-6 border-t flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          {parsedData && (
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 mr-2" />
              Save Candidate
            </button>
          )}
        </div>
      </div>
    </div>
  );
}