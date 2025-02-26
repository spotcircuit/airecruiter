'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { 
  DocumentTextIcon, 
  DocumentArrowUpIcon, 
  DocumentCheckIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ParsedResume {
  name: string;
  email: string;
  phone?: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  summary?: string;
  links?: Link[];
}

interface Education {
  institution: string;
  degree: string;
  field?: string;
  startDate?: string;
  endDate?: string;
  gpa?: number;
}

interface Experience {
  company: string;
  title: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
  highlights?: string[];
}

interface Link {
  type: 'linkedin' | 'github' | 'portfolio' | 'other';
  url: string;
}

interface ResumeParserProps {
  onParsed: (resume: ParsedResume) => void;
  jobTitle?: string;
  jobDescription?: string;
  className?: string;
}

export default function ResumeParser({
  onParsed,
  jobTitle,
  jobDescription,
  className = '',
}: ResumeParserProps): JSX.Element {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedResume | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setError(null);
    
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }
    
    // Validate file size (max 5MB)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    
    setError(null);
    
    const droppedFile = e.dataTransfer.files?.[0] || null;
    if (!droppedFile) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validTypes.includes(droppedFile.type)) {
      setError('Please upload a PDF or Word document');
      return;
    }
    
    // Validate file size (max 5MB)
    if (droppedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }
    
    setFile(droppedFile);
  };

  const parseResume = async (): Promise<void> => {
    if (!file) return;
    
    setParsing(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('resume', file);
      
      if (jobTitle) {
        formData.append('jobTitle', jobTitle);
      }
      
      if (jobDescription) {
        formData.append('jobDescription', jobDescription);
      }
      
      // In a real implementation, you would send the formData to your API
      // const response = await fetch('/api/parse-resume', {
      //   method: 'POST',
      //   body: formData,
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to parse resume');
      // }
      
      // const data = await response.json();
      
      // For demo purposes, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      const mockParsedData: ParsedResume = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '(555) 123-4567',
        education: [
          {
            institution: 'Stanford University',
            degree: 'Master of Science',
            field: 'Computer Science',
            startDate: '2018-09',
            endDate: '2020-06',
            gpa: 3.8,
          },
          {
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            field: 'Computer Engineering',
            startDate: '2014-09',
            endDate: '2018-05',
            gpa: 3.7,
          },
        ],
        experience: [
          {
            company: 'Google',
            title: 'Software Engineer',
            location: 'Mountain View, CA',
            startDate: '2020-07',
            endDate: 'Present',
            description: 'Working on Google Cloud Platform services',
            highlights: [
              'Developed and maintained microservices using Go and Kubernetes',
              'Improved system reliability by implementing comprehensive monitoring',
              'Reduced API latency by 30% through caching and optimization',
            ],
          },
          {
            company: 'Facebook',
            title: 'Software Engineering Intern',
            location: 'Menlo Park, CA',
            startDate: '2019-05',
            endDate: '2019-08',
            description: 'Worked on the News Feed team',
            highlights: [
              'Implemented new features for the News Feed using React and GraphQL',
              'Participated in code reviews and design discussions',
              'Developed automated testing tools to improve code quality',
            ],
          },
        ],
        skills: [
          'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 
          'Go', 'Kubernetes', 'Docker', 'AWS', 'GCP', 'SQL', 'NoSQL',
          'Machine Learning', 'CI/CD', 'Git'
        ],
        summary: 'Experienced software engineer with a strong background in cloud technologies and distributed systems. Passionate about building scalable and reliable software solutions.',
        links: [
          {
            type: 'linkedin',
            url: 'https://linkedin.com/in/johndoe',
          },
          {
            type: 'github',
            url: 'https://github.com/johndoe',
          },
          {
            type: 'portfolio',
            url: 'https://johndoe.dev',
          },
        ],
      };
      
      setParsedData(mockParsedData);
      onParsed(mockParsedData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setParsing(false);
    }
  };

  const resetParser = (): void => {
    setFile(null);
    setParsedData(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {!file ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 dark:border-gray-600 dark:hover:border-primary-400"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upload Resume</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Drag and drop your resume or click to browse
          </p>
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
            Supports PDF, DOC, DOCX (Max 5MB)
          </p>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          />
        </div>
      ) : (
        <div className="border rounded-lg p-6 bg-white dark:bg-gray-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <DocumentTextIcon className="h-6 w-6 text-primary-500 dark:text-primary-400 mr-2" />
              <span className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                {file.name}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              {!parsing && !parsedData && (
                <button
                  type="button"
                  onClick={parseResume}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Parse Resume
                </button>
              )}
              <button
                type="button"
                onClick={resetParser}
                className="inline-flex items-center px-2 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <XCircleIcon className="h-4 w-4 mr-1" />
                Reset
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-md dark:bg-red-900/20 dark:text-red-400">
              {error}
            </div>
          )}
          
          {parsing && (
            <div className="flex items-center justify-center py-6">
              <ArrowPathIcon className="h-6 w-6 text-primary-500 dark:text-primary-400 animate-spin mr-2" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Parsing resume...</span>
            </div>
          )}
          
          {parsedData && (
            <div className="mt-4 space-y-4">
              <div className="border-b pb-2 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{parsedData.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{parsedData.email}</p>
                {parsedData.phone && (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{parsedData.phone}</p>
                )}
              </div>
              
              {parsedData.summary && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Summary</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{parsedData.summary}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {parsedData.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Experience</h4>
                <div className="space-y-3">
                  {parsedData.experience.map((exp, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{exp.title}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {exp.startDate} - {exp.endDate || 'Present'}
                        </span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">{exp.company}</div>
                      {exp.location && (
                        <div className="text-gray-500 dark:text-gray-400">{exp.location}</div>
                      )}
                      {exp.highlights && exp.highlights.length > 0 && (
                        <ul className="mt-1 list-disc list-inside text-gray-500 dark:text-gray-400">
                          {exp.highlights.map((highlight, i) => (
                            <li key={i}>{highlight}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Education</h4>
                <div className="space-y-3">
                  {parsedData.education.map((edu, index) => (
                    <div key={index} className="text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-900 dark:text-white">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</span>
                        <span className="text-gray-500 dark:text-gray-400">
                          {edu.startDate} - {edu.endDate}
                        </span>
                      </div>
                      <div className="text-gray-700 dark:text-gray-300">{edu.institution}</div>
                      {edu.gpa && (
                        <div className="text-gray-500 dark:text-gray-400">GPA: {edu.gpa}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {parsedData.links && parsedData.links.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Links</h4>
                  <div className="space-y-1">
                    {parsedData.links.map((link, index) => (
                      <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
                      >
                        {link.type.charAt(0).toUpperCase() + link.type.slice(1)}: {link.url}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="pt-4 flex justify-center">
                <DocumentCheckIcon className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" />
                <span className="text-sm text-gray-700 dark:text-gray-300">Resume successfully parsed</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
