'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BuildingOfficeIcon, MapPinIcon, UsersIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

type Company = {
  id: string;
  name: string;
  logo: string;
  description: string;
  location: string;
  size: string;
  industry: string;
  hiringStatus: 'Actively Hiring' | 'Selective Hiring' | 'Hiring Freeze';
  remotePolicy: 'Fully Remote' | 'Hybrid' | 'On-site';
  openPositions: number;
  lastUpdated: string;
  keyDecisionMakers?: {
    name: string;
    title: string;
    linkedIn?: string;
  }[];
  hiringChallenges?: string[];
  techStack?: string[];
  growthStage?: 'Startup' | 'Scale-up' | 'Enterprise' | 'SMB';
  fundingStatus?: string;
  hiringBudget?: string;
  hiringGoals?: string;
  hiringTimeline?: string;
  recruitingPartners?: boolean;
  talentNeeds?: string[];
};

export function CompanyList() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // TODO: Replace with actual API call
        // Mock data for now
        const mockCompanies: Company[] = [
          {
            id: 'techstart',
            name: 'TechStart Inc.',
            logo: '/images/companies/techstart-logo.svg',
            description: 'Building the future of AI-powered recruitment tools for small businesses and startups.',
            location: 'San Francisco, CA',
            size: '11-50',
            industry: 'Technology',
            hiringStatus: 'Actively Hiring',
            remotePolicy: 'Fully Remote',
            openPositions: 8,
            lastUpdated: '2 days ago',
            keyDecisionMakers: [
              { name: 'Sarah Chen', title: 'VP of Engineering', linkedIn: 'https://linkedin.com/in/sarahchen' },
              { name: 'Michael Rodriguez', title: 'Head of Talent Acquisition', linkedIn: 'https://linkedin.com/in/michaelrodriguez' }
            ],
            hiringChallenges: ['Finding senior engineers with AI experience', 'Competing with tech giants for talent'],
            techStack: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
            growthStage: 'Scale-up',
            fundingStatus: 'Series A - $12M',
            hiringBudget: '$500K - $1M annually',
            hiringGoals: 'Double engineering team in next 6 months',
            hiringTimeline: 'Immediate',
            recruitingPartners: false,
            talentNeeds: ['Senior AI Engineers', 'Full-stack Developers', 'Product Designers', 'DevOps Specialists']
          },
          {
            id: 'healthinnovate',
            name: 'HealthInnovate',
            logo: '/images/companies/healthinnovate-logo.svg',
            description: 'Revolutionizing healthcare with AI-driven diagnostics and patient care solutions.',
            location: 'Boston, MA',
            size: '51-250',
            industry: 'Healthcare',
            hiringStatus: 'Actively Hiring',
            remotePolicy: 'Hybrid',
            openPositions: 12,
            lastUpdated: '1 week ago',
            keyDecisionMakers: [
              { name: 'Dr. Emily Watson', title: 'Chief Medical Officer', linkedIn: 'https://linkedin.com/in/emilywatson' },
              { name: 'Robert Kim', title: 'Director of HR', linkedIn: 'https://linkedin.com/in/robertkim' }
            ],
            hiringChallenges: ['Finding healthcare professionals with tech experience', 'Regulatory compliance expertise'],
            techStack: ['Python', 'TensorFlow', 'React', 'AWS', 'Kubernetes'],
            growthStage: 'Scale-up',
            fundingStatus: 'Series B - $35M',
            hiringBudget: '$1M - $2M annually',
            hiringGoals: 'Expand clinical team and engineering department',
            hiringTimeline: 'Next quarter',
            recruitingPartners: true,
            talentNeeds: ['Machine Learning Engineers', 'Healthcare Data Scientists', 'Regulatory Affairs Specialists', 'Clinical Research Coordinators']
          },
          {
            id: 'edutech-labs',
            name: 'EduTech Labs',
            logo: '/images/companies/edutech-labs-logo.svg',
            description: 'Creating innovative educational technology to make learning accessible to everyone.',
            location: 'Austin, TX',
            size: '1-10',
            industry: 'Education',
            hiringStatus: 'Selective Hiring',
            remotePolicy: 'Fully Remote',
            openPositions: 3,
            lastUpdated: '3 days ago',
            keyDecisionMakers: [
              { name: 'James Wilson', title: 'Founder & CEO', linkedIn: 'https://linkedin.com/in/jameswilson' }
            ],
            hiringChallenges: ['Limited budget', 'Finding specialized education technology experts'],
            techStack: ['JavaScript', 'React Native', 'Node.js', 'MongoDB', 'AWS'],
            growthStage: 'Startup',
            fundingStatus: 'Seed - $2M',
            hiringBudget: '$150K - $300K annually',
            hiringGoals: 'Build core product team',
            hiringTimeline: 'Next 3 months',
            recruitingPartners: false,
            talentNeeds: ['Education Technology Specialists', 'Mobile Developers', 'UX/UI Designers']
          },
          {
            id: 'fintech-global',
            name: 'FinTech Global',
            logo: '/images/companies/fintech-global-logo.svg',
            description: 'Transforming financial services with blockchain and AI-powered solutions for banks and enterprises.',
            location: 'New York, NY',
            size: '251-500',
            industry: 'Financial Services',
            hiringStatus: 'Actively Hiring',
            remotePolicy: 'Hybrid',
            openPositions: 15,
            lastUpdated: '5 days ago',
            keyDecisionMakers: [
              { name: 'Amanda Johnson', title: 'Chief People Officer', linkedIn: 'https://linkedin.com/in/amandajohnson' },
              { name: 'David Chang', title: 'VP of Engineering', linkedIn: 'https://linkedin.com/in/davidchang' }
            ],
            hiringChallenges: ['Finding blockchain specialists', 'Competitive financial sector compensation'],
            techStack: ['Solidity', 'React', 'Node.js', 'AWS', 'Python', 'TensorFlow'],
            growthStage: 'Enterprise',
            fundingStatus: 'Series C - $75M',
            hiringBudget: '$3M - $5M annually',
            hiringGoals: 'Expand blockchain team and AI research division',
            hiringTimeline: 'Ongoing',
            recruitingPartners: true,
            talentNeeds: ['Blockchain Developers', 'Financial Analysts', 'AI/ML Engineers', 'Security Specialists']
          },
          {
            id: 'green-energy-solutions',
            name: 'Green Energy Solutions',
            logo: '/images/companies/green-energy-solutions-logo.svg',
            description: 'Developing sustainable energy technologies and smart grid solutions for a greener future.',
            location: 'Portland, OR',
            size: '51-250',
            industry: 'Clean Energy',
            hiringStatus: 'Actively Hiring',
            remotePolicy: 'Hybrid',
            openPositions: 7,
            lastUpdated: '1 week ago',
            keyDecisionMakers: [
              { name: 'Lisa Martinez', title: 'Director of Talent', linkedIn: 'https://linkedin.com/in/lisamartinez' },
              { name: 'Thomas Green', title: 'CTO', linkedIn: 'https://linkedin.com/in/thomasgreen' }
            ],
            hiringChallenges: ['Finding engineers with renewable energy experience', 'Specialized technical expertise'],
            techStack: ['Python', 'IoT', 'AWS', 'React', 'TensorFlow'],
            growthStage: 'Scale-up',
            fundingStatus: 'Series B - $40M',
            hiringBudget: '$1M - $2M annually',
            hiringGoals: 'Build out engineering and research teams',
            hiringTimeline: 'Next 6 months',
            recruitingPartners: true,
            talentNeeds: ['Renewable Energy Engineers', 'IoT Specialists', 'Data Scientists', 'Embedded Systems Engineers']
          },
          {
            id: 'retail-tech-innovations',
            name: 'RetailTech Innovations',
            logo: '/images/companies/retail-tech-innovations-logo.svg',
            description: 'Revolutionizing retail with AI-powered inventory management and customer experience solutions.',
            location: 'Chicago, IL',
            size: '11-50',
            industry: 'Retail Technology',
            hiringStatus: 'Selective Hiring',
            remotePolicy: 'On-site',
            openPositions: 5,
            lastUpdated: '2 weeks ago',
            keyDecisionMakers: [
              { name: 'Kevin Park', title: 'Head of People Operations', linkedIn: 'https://linkedin.com/in/kevinpark' }
            ],
            hiringChallenges: ['Finding retail domain experts with tech skills', 'Competitive local market'],
            techStack: ['Python', 'React', 'Computer Vision', 'AWS', 'Node.js'],
            growthStage: 'Startup',
            fundingStatus: 'Seed - $5M',
            hiringBudget: '$500K - $750K annually',
            hiringGoals: 'Expand product and engineering teams',
            hiringTimeline: 'Q3 2025',
            recruitingPartners: false,
            talentNeeds: ['Computer Vision Engineers', 'Retail Analytics Specialists', 'Full-stack Developers', 'Product Managers']
          },
        ];

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        setCompanies(mockCompanies);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
        setError('Failed to load companies. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompanies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ArrowPathIcon className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Loading companies...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="text-center py-12">
        <BuildingOfficeIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No companies found</h3>
        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing <span className="font-medium">{companies.length}</span> companies
        </p>
        <div className="flex items-center">
          <label htmlFor="sort" className="text-sm font-medium text-gray-700 mr-2">
            Sort by:
          </label>
          <select
            id="sort"
            name="sort"
            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            defaultValue="most-recent"
          >
            <option value="most-recent">Most Recent</option>
            <option value="most-positions">Most Open Positions</option>
            <option value="company-name">Company Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow-md overflow-hidden rounded-xl">
        <ul role="list" className="divide-y divide-gray-100">
          {companies.map((company) => (
            <li key={company.id} className="hover:bg-blue-50 group transition-colors duration-150">
              <Link href={`/companies/${company.id}`} className="block">
                <div className="px-6 py-6">
                  <div className="flex flex-col space-y-5">
                    {/* Company header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-14 w-14 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
                          <BuildingOfficeIcon className="h-8 w-8 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {company.name}
                            </h3>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                              {company.hiringStatus}
                            </span>
                            {company.growthStage && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                {company.growthStage}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 max-w-3xl">{company.description}</p>
                        </div>
                      </div>
                      <div className="hidden lg:block text-right">
                        <div className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white shadow-sm">
                          <span className="mr-1.5">{company.openPositions}</span>
                          <span>Open Positions</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Updated {company.lastUpdated}</p>
                      </div>
                    </div>

                    {/* Company details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                      {/* Left column */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Company Info</h4>
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {company.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <UsersIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                              {company.size} employees
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              {company.industry}
                            </div>
                            {company.fundingStatus && (
                              <div className="flex items-center text-sm text-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {company.fundingStatus}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Middle column */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Decision Makers</h4>
                          <div className="flex flex-col space-y-2">
                            {company.keyDecisionMakers?.map((person, index) => (
                              <div key={index} className="flex items-center text-sm">
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2 flex-shrink-0">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-900">{person.name}</span>
                                  <span className="text-gray-500 mx-1">•</span>
                                  <span className="text-gray-600">{person.title}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right column */}
                      <div className="space-y-3">
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Hiring Needs</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {company.talentNeeds?.slice(0, 3).map((need, index) => (
                              <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                                {need}
                              </span>
                            ))}
                            {company.talentNeeds && company.talentNeeds.length > 3 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-blue-600 border border-gray-200">
                                +{company.talentNeeds.length - 3} more
                              </span>
                            )}
                          </div>
                          {company.hiringGoals && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Hiring Goal:</span> {company.hiringGoals}
                            </div>
                          )}
                          {company.hiringTimeline && (
                            <div className="mt-1 text-sm text-gray-600">
                              <span className="font-medium">Timeline:</span> {company.hiringTimeline}
                            </div>
                          )}
                          <div className="mt-2 text-right">
                            <span className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:text-blue-800">
                              View Partnership Opportunities
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}