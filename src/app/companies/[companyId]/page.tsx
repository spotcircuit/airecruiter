'use client';

import React from 'react';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import {
  BuildingOfficeIcon,
  MapPinIcon,
  UsersIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  GlobeAltIcon,
  UserGroupIcon,
  CalendarIcon,
  DocumentTextIcon,
  LightBulbIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon,
  LinkIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

// Mock data - replace with actual API call
const getCompanyDetails = (id: string) => {
  const companies = [
    {
      id: 'techstart',
      name: 'TechStart Inc.',
      description: 'Building the future of AI-powered recruitment tools for small businesses and startups.',
      logo: '/images/companies/techstart-logo.svg',
      website: 'https://techstart.example.com',
      industry: 'Technology',
      companySize: '11-50 employees',
      founded: '2015',
      headquarters: 'San Francisco, CA',
      specialities: 'AI, Recruitment, SaaS',
      hiringStatus: 'Actively hiring',
      openPositions: 8,
      about: 'At TechStart, we believe in building technology that makes a difference. Our team of talented engineers, designers, and product managers work together to create innovative solutions.',
      culture: 'Our culture is built on trust, transparency, and a shared passion for technology. We encourage our team members to take ownership of their work.',
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        '401(k) with company match',
        'Flexible work hours and remote work options',
        'Professional development budget'
      ],
      techStack: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
      contact: {
        email: 'talent@techstart.example.com',
        phone: '(555) 123-4567',
        linkedin: 'https://linkedin.com/company/techstart',
      },
      activeJobIds: ['1', '2'],
      // New fields for recruiting partnerships
      keyDecisionMakers: [
        { name: 'Sarah Chen', title: 'VP of Engineering', email: 'sarah@techstart.example.com', linkedin: 'https://linkedin.com/in/sarahchen' },
        { name: 'Michael Rodriguez', title: 'Head of Talent Acquisition', email: 'michael@techstart.example.com', linkedin: 'https://linkedin.com/in/michaelrodriguez' }
      ],
      hiringChallenges: [
        'Finding senior engineers with AI experience',
        'Competing with tech giants for talent',
        'Scaling the team while maintaining culture',
        'Hiring specialized ML engineers'
      ],
      growthStage: 'Scale-up',
      fundingStatus: 'Series A - $12M',
      hiringBudget: '$500K - $1M annually',
      hiringGoals: 'Double engineering team in next 6 months',
      hiringTimeline: 'Immediate',
      recruitingPartners: false,
      talentNeeds: [
        { role: 'Senior AI Engineer', count: 3, priority: 'High', skills: ['TensorFlow', 'Python', 'ML Ops', 'Computer Vision'] },
        { role: 'Full-stack Developer', count: 2, priority: 'Medium', skills: ['React', 'Node.js', 'TypeScript', 'AWS'] },
        { role: 'Product Designer', count: 1, priority: 'Medium', skills: ['UI/UX', 'Figma', 'User Research'] },
        { role: 'DevOps Specialist', count: 2, priority: 'High', skills: ['Kubernetes', 'Docker', 'CI/CD', 'AWS'] }
      ],
      hiringProcess: [
        'Initial screening call (30 min)',
        'Technical assessment (take-home)',
        'Technical interview (1 hour)',
        'Culture fit interview (45 min)',
        'Final interview with leadership (1 hour)'
      ],
      previousRecruitingExperience: 'Worked with smaller agencies but struggled with quality of technical candidates',
      preferredCommunicationChannel: 'Email for initial contact, Slack for ongoing communication',
      decisionMakingProcess: 'Head of Talent Acquisition makes initial vendor selections, final approval from VP of Engineering'
    },
    {
      id: 'green-energy-solutions',
      name: 'Green Energy Solutions',
      description: 'Pioneering sustainable energy solutions and green technology for a cleaner future.',
      logo: '/images/companies/green-energy-solutions-logo.svg',
      website: 'https://greenenergy.example.com',
      industry: 'Renewable Energy',
      companySize: '51-200 employees',
      founded: '2012',
      headquarters: 'Austin, TX',
      specialities: 'Solar Energy, Wind Power, Energy Storage, Sustainability',
      hiringStatus: 'Actively hiring',
      openPositions: 15,
      about: 'Green Energy Solutions is dedicated to accelerating the world\'s transition to sustainable energy. We develop cutting-edge renewable energy technologies and solutions that help businesses and communities reduce their carbon footprint.',
      culture: 'Our company culture is built around environmental stewardship, innovation, and collaboration. We\'re passionate about making a positive impact on the planet and creating a workplace where diverse perspectives thrive.',
      benefits: [
        'Competitive compensation with equity options',
        'Comprehensive health, dental, and vision coverage',
        'Generous paid time off and parental leave',
        'Sustainable commuter benefits',
        'Professional development stipend',
        'Employee wellness program'
      ],
      techStack: ['Python', 'IoT', 'Machine Learning', 'AWS', 'React', 'Node.js'],
      contact: {
        email: 'careers@greenenergy.example.com',
        phone: '(555) 789-0123',
        linkedin: 'https://linkedin.com/company/green-energy-solutions',
      },
      activeJobIds: ['5', '6', '7'],
      keyDecisionMakers: [
        { name: 'Emma Patel', title: 'Chief Technology Officer', email: 'emma@greenenergy.example.com', linkedin: 'https://linkedin.com/in/emmapatel' },
        { name: 'David Wilson', title: 'VP of Engineering', email: 'david@greenenergy.example.com', linkedin: 'https://linkedin.com/in/davidwilson' },
        { name: 'Jessica Martinez', title: 'Director of Talent Acquisition', email: 'jessica@greenenergy.example.com', linkedin: 'https://linkedin.com/in/jessicamartinez' }
      ],
      hiringChallenges: [
        'Finding engineers with renewable energy industry experience',
        'Attracting top talent in competitive markets',
        'Building diverse technical teams',
        'Scaling hiring to meet rapid growth needs'
      ],
      growthStage: 'Scale-up',
      fundingStatus: 'Series B - $45M',
      hiringBudget: '$2M - $3M annually',
      hiringGoals: 'Expand engineering and product teams to support new product lines',
      hiringTimeline: 'Next 3-6 months',
      recruitingPartners: true,
      talentNeeds: [
        { role: 'Senior Software Engineer', count: 5, priority: 'High', skills: ['Python', 'IoT', 'Cloud Architecture', 'Distributed Systems'] },
        { role: 'Machine Learning Engineer', count: 3, priority: 'High', skills: ['TensorFlow', 'PyTorch', 'Energy Forecasting', 'Time Series Analysis'] },
        { role: 'Frontend Engineer', count: 4, priority: 'Medium', skills: ['React', 'TypeScript', 'Data Visualization', 'Responsive Design'] },
        { role: 'Energy Systems Engineer', count: 3, priority: 'High', skills: ['Electrical Engineering', 'Battery Systems', 'Power Electronics'] }
      ],
      hiringProcess: [
        'Initial recruiter screen (30 min)',
        'Technical assessment (relevant to role)',
        'Panel interview with team members (1 hour)',
        'Technical deep dive with senior engineers (1 hour)',
        'Final interview with leadership (45 min)'
      ],
      previousRecruitingExperience: 'Have worked with several recruiting agencies with mixed results. Looking for partners who understand the renewable energy sector and technical requirements.',
      preferredCommunicationChannel: 'Weekly email updates and bi-weekly video calls for active searches',
      decisionMakingProcess: 'Director of Talent Acquisition evaluates recruiting partners, with input from hiring managers and final approval from CTO'
    },
    {
      id: 'healthinnovate',
      name: 'HealthInnovate',
      description: 'Revolutionizing healthcare with AI-driven diagnostics and patient care solutions.',
      logo: '/images/companies/healthinnovate-logo.svg',
      website: 'https://healthinnovate.example.com',
      industry: 'Healthcare Technology',
      companySize: '101-500 employees',
      founded: '2014',
      headquarters: 'Boston, MA',
      specialities: 'AI Diagnostics, Telemedicine, Healthcare Analytics, Patient Monitoring',
      hiringStatus: 'Actively hiring',
      openPositions: 12,
      about: 'HealthInnovate is transforming healthcare through innovative AI-driven solutions. Our platform helps healthcare providers deliver better patient outcomes through advanced diagnostics, real-time monitoring, and predictive analytics.',
      culture: 'We foster a culture of innovation, empathy, and continuous learning. Our team is passionate about improving healthcare access and outcomes for all patients.',
      benefits: [
        'Competitive salary and comprehensive benefits',
        'Flexible work arrangements',
        'Health and wellness stipend',
        'Continuing education support',
        'Generous parental leave',
        'Annual team retreats'
      ],
      techStack: ['Python', 'TensorFlow', 'React', 'AWS', 'Kubernetes', 'MongoDB'],
      contact: {
        email: 'careers@healthinnovate.example.com',
        phone: '(555) 456-7890',
        linkedin: 'https://linkedin.com/company/healthinnovate',
      },
      activeJobIds: ['8', '9', '10'],
      keyDecisionMakers: [
        { name: 'Dr. Emily Watson', title: 'Chief Medical Officer', email: 'emily@healthinnovate.example.com', linkedin: 'https://linkedin.com/in/emilywatson' },
        { name: 'Robert Kim', title: 'Director of HR', email: 'robert@healthinnovate.example.com', linkedin: 'https://linkedin.com/in/robertkim' },
        { name: 'James Chen', title: 'VP of Engineering', email: 'james@healthinnovate.example.com', linkedin: 'https://linkedin.com/in/jameschen' }
      ],
      hiringChallenges: [
        'Finding healthcare professionals with tech experience',
        'Competing with big tech for AI talent',
        'Regulatory compliance expertise',
        'Balancing technical and healthcare domain knowledge'
      ],
      growthStage: 'Scale-up',
      fundingStatus: 'Series B - $35M',
      hiringBudget: '$1M - $2M annually',
      hiringGoals: 'Expand clinical team and engineering department',
      hiringTimeline: 'Next quarter',
      recruitingPartners: true,
      talentNeeds: [
        { role: 'ML Engineer', count: 4, priority: 'High', skills: ['Python', 'TensorFlow', 'Medical Imaging', 'NLP'] },
        { role: 'Healthcare Data Scientist', count: 3, priority: 'High', skills: ['Biostatistics', 'Python', 'R', 'Clinical Data Analysis'] },
        { role: 'Regulatory Compliance Specialist', count: 2, priority: 'Medium', skills: ['HIPAA', 'FDA Regulations', 'Medical Device Compliance'] },
        { role: 'UI/UX Designer', count: 2, priority: 'Medium', skills: ['Healthcare UX', 'Figma', 'Accessibility', 'User Research'] }
      ],
      hiringProcess: [
        'Initial HR screening (30 min)',
        'Technical/domain assessment',
        'Panel interview with team members (1 hour)',
        'Case study presentation',
        'Final interview with leadership (1 hour)'
      ],
      previousRecruitingExperience: 'Have worked with healthcare-specialized recruiting firms with good results, but struggled with technical talent acquisition.',
      preferredCommunicationChannel: 'Weekly status calls and email updates',
      decisionMakingProcess: 'Director of HR coordinates the hiring process, with final decisions made by department heads and CMO'
    },
    {
      id: 'edutech-labs',
      name: 'EduTech Labs',
      description: 'Transforming education through innovative learning platforms and AI-powered personalization.',
      logo: '/images/companies/edutech-labs-logo.svg',
      website: 'https://edutechlabs.example.com',
      industry: 'Education Technology',
      companySize: '51-200 employees',
      founded: '2016',
      headquarters: 'Chicago, IL',
      specialities: 'Adaptive Learning, Educational Games, Learning Analytics, K-12 Solutions',
      hiringStatus: 'Actively hiring',
      openPositions: 10,
      about: 'EduTech Labs is on a mission to make quality education accessible to all through technology. Our adaptive learning platforms personalize education for each student, helping them achieve better outcomes regardless of their background or learning style.',
      culture: 'We believe in the power of education to transform lives. Our team combines educators, technologists, and researchers who are passionate about creating impactful learning experiences.',
      benefits: [
        'Competitive compensation',
        'Comprehensive healthcare',
        'Flexible work arrangements',
        'Professional development fund',
        'Student loan repayment assistance',
        'Volunteer time off'
      ],
      techStack: ['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'TensorFlow'],
      contact: {
        email: 'careers@edutechlabs.example.com',
        phone: '(555) 234-5678',
        linkedin: 'https://linkedin.com/company/edutechlabs',
      },
      activeJobIds: ['11', '12', '13'],
      keyDecisionMakers: [
        { name: 'Maria Lopez', title: 'Chief Product Officer', email: 'maria@edutechlabs.example.com', linkedin: 'https://linkedin.com/in/marialopez' },
        { name: 'David Thompson', title: 'Director of HR', email: 'david@edutechlabs.example.com', linkedin: 'https://linkedin.com/in/davidthompson' },
        { name: 'Dr. Sarah Johnson', title: 'Chief Learning Officer', email: 'sarah@edutechlabs.example.com', linkedin: 'https://linkedin.com/in/sarahjohnson' }
      ],
      hiringChallenges: [
        'Finding talent with both education and tech backgrounds',
        'Scaling engineering team quickly',
        'Competing with higher-paying tech companies',
        'Finding specialists in learning science and analytics'
      ],
      growthStage: 'Scale-up',
      fundingStatus: 'Series B - $28M',
      hiringBudget: '$1M - $1.5M annually',
      hiringGoals: 'Double product and engineering teams',
      hiringTimeline: 'Next quarter',
      recruitingPartners: true,
      talentNeeds: [
        { role: 'Full-stack Engineer', count: 5, priority: 'High', skills: ['React', 'Node.js', 'TypeScript', 'MongoDB'] },
        { role: 'UX/UI Designer', count: 3, priority: 'Medium', skills: ['Educational UX', 'Figma', 'User Research', 'Accessibility'] },
        { role: 'Education Content Specialist', count: 2, priority: 'Medium', skills: ['Curriculum Development', 'K-12 Education', 'Content Strategy'] },
        { role: 'Product Manager', count: 2, priority: 'High', skills: ['EdTech Experience', 'Agile', 'Product Strategy', 'User Testing'] }
      ],
      hiringProcess: [
        'Initial screening call (30 min)',
        'Skills assessment or portfolio review',
        'Team interview (1 hour)',
        'Case study or presentation',
        'Final interview with leadership'
      ],
      previousRecruitingExperience: 'Mixed results with general recruiting firms. Best success with education-specialized recruiters who understand the industry.',
      preferredCommunicationChannel: 'Bi-weekly video calls and shared candidate tracking system',
      decisionMakingProcess: 'Collaborative hiring with input from team members, final decisions made by department heads and CPO'
    },
    {
      id: 'fintech-global',
      name: 'FinTech Global',
      description: 'Revolutionizing financial services with blockchain, AI, and secure payment solutions.',
      logo: '/images/companies/fintech-global-logo.svg',
      website: 'https://fintechglobal.example.com',
      industry: 'Financial Technology',
      companySize: '201-500 employees',
      founded: '2013',
      headquarters: 'New York, NY',
      specialities: 'Blockchain, Digital Payments, Financial AI, Cybersecurity',
      hiringStatus: 'Actively hiring',
      openPositions: 15,
      about: 'FinTech Global is building the future of financial services. Our suite of products helps banks, credit unions, and financial institutions deliver secure, innovative services to their customers while reducing costs and improving efficiency.',
      culture: 'We combine the innovation of a tech company with the security mindset of a financial institution. Our team values precision, security, and continuous improvement.',
      benefits: [
        'Top-tier compensation package',
        'Comprehensive benefits',
        'Flexible work arrangements',
        'Annual performance bonuses',
        'Professional certification support',
        'Financial wellness program'
      ],
      techStack: ['Golang', 'React', 'Solidity', 'AWS', 'Kubernetes', 'PostgreSQL'],
      contact: {
        email: 'careers@fintechglobal.example.com',
        phone: '(555) 876-5432',
        linkedin: 'https://linkedin.com/company/fintechglobal',
      },
      activeJobIds: ['14', '15', '16'],
      keyDecisionMakers: [
        { name: 'James Wilson', title: 'CTO', email: 'james@fintechglobal.example.com', linkedin: 'https://linkedin.com/in/jameswilson' },
        { name: 'Sophia Martinez', title: 'VP of People', email: 'sophia@fintechglobal.example.com', linkedin: 'https://linkedin.com/in/sophiamartinez' },
        { name: 'Michael Chang', title: 'Director of Engineering', email: 'michael@fintechglobal.example.com', linkedin: 'https://linkedin.com/in/michaelchang' }
      ],
      hiringChallenges: [
        'Finding blockchain specialists',
        'Competitive compensation packages',
        'Security clearance requirements',
        'Balancing technical skills with financial domain knowledge'
      ],
      growthStage: 'Scale-up',
      fundingStatus: 'Series C - $75M',
      hiringBudget: '$2M - $3M annually',
      hiringGoals: 'Strategic hires in blockchain and security',
      hiringTimeline: 'Q3 2025',
      recruitingPartners: true,
      talentNeeds: [
        { role: 'Blockchain Engineer', count: 4, priority: 'High', skills: ['Solidity', 'Ethereum', 'Smart Contracts', 'DeFi'] },
        { role: 'Security Specialist', count: 3, priority: 'High', skills: ['Application Security', 'Penetration Testing', 'Compliance', 'Risk Assessment'] },
        { role: 'Financial Analyst', count: 2, priority: 'Medium', skills: ['Financial Modeling', 'Risk Analysis', 'Banking Regulations'] },
        { role: 'Product Manager', count: 3, priority: 'High', skills: ['FinTech Experience', 'Agile', 'Product Strategy', 'Financial Services'] }
      ],
      hiringProcess: [
        'Initial screening (30 min)',
        'Technical assessment or case study',
        'Panel interview with team (1 hour)',
        'Security and background check',
        'Final interview with executive team'
      ],
      previousRecruitingExperience: 'Worked with specialized FinTech recruiters with good results. Internal referrals have been our best source of quality candidates.',
      preferredCommunicationChannel: 'Weekly status reports and bi-weekly calls',
      decisionMakingProcess: 'VP of People oversees the hiring process, with technical evaluation by engineering leads and final approval from CTO'
    },
    {
      id: 'retail-tech-innovations',
      name: 'RetailTech Innovations',
      description: 'Transforming retail experiences through AI, IoT, and omnichannel solutions.',
      logo: '/images/companies/retail-tech-innovations-logo.svg',
      website: 'https://retailtech.example.com',
      industry: 'Retail Technology',
      companySize: '101-250 employees',
      founded: '2015',
      headquarters: 'Seattle, WA',
      specialities: 'Inventory Management, Customer Analytics, Smart Retail, Supply Chain Optimization',
      hiringStatus: 'Actively hiring',
      openPositions: 8,
      about: 'RetailTech Innovations is helping retailers thrive in the digital age. Our platform combines AI, IoT, and data analytics to create seamless shopping experiences, optimize inventory, and drive customer loyalty.',
      culture: 'We blend retail expertise with technological innovation. Our team is customer-obsessed and data-driven, constantly seeking new ways to improve the retail experience.',
      benefits: [
        'Competitive salary and equity',
        'Comprehensive healthcare',
        'Flexible work arrangements',
        'Employee discount programs',
        'Professional development fund',
        'Wellness program'
      ],
      techStack: ['React', 'Python', 'TensorFlow', 'AWS', 'IoT', 'Microservices'],
      contact: {
        email: 'careers@retailtech.example.com',
        phone: '(555) 345-6789',
        linkedin: 'https://linkedin.com/company/retailtech-innovations',
      },
      activeJobIds: ['17', '18', '19'],
      keyDecisionMakers: [
        { name: 'Jennifer Lee', title: 'Chief Product Officer', email: 'jennifer@retailtech.example.com', linkedin: 'https://linkedin.com/in/jenniferlee' },
        { name: 'Thomas Garcia', title: 'VP of Engineering', email: 'thomas@retailtech.example.com', linkedin: 'https://linkedin.com/in/thomasgarcia' },
        { name: 'Rachel Kim', title: 'Director of Talent', email: 'rachel@retailtech.example.com', linkedin: 'https://linkedin.com/in/rachelkim' }
      ],
      hiringChallenges: [
        'Finding engineers with retail domain knowledge',
        'Competing with big tech for AI talent',
        'Building diverse teams',
        'Scaling quickly to meet market demand'
      ],
      growthStage: 'Scale-up',
      fundingStatus: 'Series B - $32M',
      hiringBudget: '$1.2M - $1.8M annually',
      hiringGoals: 'Expand engineering and product teams to support new retail verticals',
      hiringTimeline: 'Next 6 months',
      recruitingPartners: true,
      talentNeeds: [
        { role: 'Full-stack Developer', count: 3, priority: 'High', skills: ['React', 'Node.js', 'TypeScript', 'Microservices'] },
        { role: 'Data Scientist', count: 2, priority: 'High', skills: ['Python', 'Machine Learning', 'Retail Analytics', 'Forecasting'] },
        { role: 'IoT Engineer', count: 2, priority: 'Medium', skills: ['Embedded Systems', 'RFID', 'Sensor Networks', 'Edge Computing'] },
        { role: 'Product Manager', count: 1, priority: 'High', skills: ['Retail Tech Experience', 'Agile', 'Product Strategy', 'User Research'] }
      ],
      hiringProcess: [
        'Initial screening call (30 min)',
        'Technical or case assessment',
        'Team interview (1 hour)',
        'Practical exercise or presentation',
        'Final interview with leadership'
      ],
      previousRecruitingExperience: 'Best results with specialized retail tech recruiters. General tech recruiters often miss the importance of domain knowledge.',
      preferredCommunicationChannel: 'Weekly email updates and monthly in-depth reviews',
      decisionMakingProcess: 'Director of Talent manages the recruitment process, with hiring decisions made collaboratively by team leads and department heads'
    }
  ];

  return companies.find(company => company.id === id);
};

// Mock job data
const getCompanyJobs = (jobIds: string[]) => {
  const allJobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      location: 'San Francisco, CA (Remote)',
      type: 'Full-time',
      experience: '5+ years',
      postedDate: '2 days ago',
      isFeatured: true
    },
    {
      id: '2',
      title: 'Product Manager',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experience: '3+ years',
      postedDate: '1 week ago',
      isFeatured: false
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      location: 'New York, NY (Hybrid)',
      type: 'Full-time',
      experience: '3+ years',
      postedDate: '3 days ago',
      isFeatured: true
    }
  ];

  return allJobs.filter(job => jobIds.includes(job.id));
};

export default function CompanyPage({ params }: { params: { companyId: string } }) {
  // Properly unwrap params using React.use()
  const unwrappedParams = React.use(params as unknown as Promise<{ companyId: string }>);
  const [showProposalForm, setShowProposalForm] = useState(false);
  const company = getCompanyDetails(unwrappedParams.companyId);
  
  if (!company) {
    notFound();
  }

  const companyJobs = getCompanyJobs(company.activeJobIds);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <div className="h-20 w-20 bg-white rounded-xl shadow-md border border-gray-100 flex items-center justify-center overflow-hidden p-1">
                  {company.logo ? (
                    <img src={company.logo} alt={`${company.name} logo`} className="h-16 w-16 object-contain" />
                  ) : (
                    <BuildingOfficeIcon className="h-10 w-10 text-blue-500" />
                  )}
                </div>
                <div className="ml-5">
                  <h1 className="text-3xl font-bold text-white">{company.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                      {company.hiringStatus}
                    </span>
                    {company.growthStage && (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {company.growthStage}
                      </span>
                    )}
                    {company.fundingStatus && (
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
                        {company.fundingStatus}
                      </span>
                    )}
                    <span className="text-sm text-blue-100 bg-blue-700/40 px-3 py-0.5 rounded-full">
                      {company.openPositions} open position{company.openPositions !== 1 ? 's' : ''}
                    </span>
                    <span className="text-sm text-blue-100">
                      <MapPinIcon className="h-4 w-4 inline-block mr-1" />
                      {company.headquarters}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 md:mt-0">
                <div className="flex space-x-3">
                  <a
                    href={`mailto:${company.contact?.email}`}
                    className="inline-flex items-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-white bg-transparent hover:bg-blue-700/50 transition-all duration-200"
                  >
                    <EnvelopeIcon className="h-5 w-5 text-blue-200 mr-2" />
                    Contact
                  </a>
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-md text-blue-700 bg-white hover:bg-gray-100 transition-all duration-200"
                    >
                      <LinkIcon className="h-5 w-5 mr-2" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Partnership Opportunity Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-blue-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Partnership Opportunity
              </h2>
              <p className="mt-2 text-blue-700">
                {company.recruitingPartners ? 
                  `${company.name} is actively seeking recruiting partners to help with their talent acquisition needs.` : 
                  `${company.name} currently doesn't have recruiting partners but has significant hiring needs.`}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule Meeting
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Key Decision Makers Card */}
            <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100">
              <div className="px-5 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Key Decision Makers
                </h2>
              </div>
              <div className="border-t border-gray-100 px-5 py-5">
                {company.keyDecisionMakers && company.keyDecisionMakers.length > 0 ? (
                  <ul className="divide-y divide-gray-100">
                    {company.keyDecisionMakers.map((person, index) => (
                      <li key={index} className={`${index > 0 ? 'pt-4 mt-4' : ''}`}>
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{person.name}</p>
                            <p className="text-sm text-gray-500">{person.title}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex space-x-2">
                          {person.email && (
                            <a href={`mailto:${person.email}`} className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1" />
                              Email
                            </a>
                          )}
                          {person.linkedin && (
                            <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                              </svg>
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No decision makers information available.</p>
                )}
              </div>
            </div>

            {/* Company Details Card */}
            <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100">
              <div className="px-5 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <BuildingOfficeIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Company Details
                </h2>
              </div>
              <div className="border-t border-gray-100 px-5 py-5">
                <dl className="space-y-5">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Industry</dt>
                    <dd className="text-sm text-gray-900 font-medium">{company.industry}</dd>
                  </div>
                  <div className="flex justify-between items-center">
                    <dt className="text-sm font-medium text-gray-500">Company size</dt>
                    <dd className="text-sm text-gray-900 flex items-center">
                      <UsersIcon className="h-4 w-4 text-blue-500 mr-1.5" />
                      <span className="font-medium">{company.companySize}</span>
                    </dd>
                  </div>
                  {company.headquarters && (
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Headquarters</dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <MapPinIcon className="h-4 w-4 text-blue-500 mr-1.5" />
                        <span className="font-medium">{company.headquarters}</span>
                      </dd>
                    </div>
                  )}
                  {company.founded && (
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Founded</dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <CalendarIcon className="h-4 w-4 text-blue-500 mr-1.5" />
                        <span className="font-medium">{company.founded}</span>
                      </dd>
                    </div>
                  )}
                  {company.hiringBudget && (
                    <div className="flex justify-between items-center">
                      <dt className="text-sm font-medium text-gray-500">Hiring Budget</dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <CurrencyDollarIcon className="h-4 w-4 text-blue-500 mr-1.5" />
                        <span className="font-medium">{company.hiringBudget}</span>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>

            {/* Contact Information Card */}
            <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-100">
              <div className="px-5 py-4">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Contact Information
                </h2>
              </div>
              <div className="border-t border-gray-100 px-5 py-5">
                <dl className="space-y-4">
                  {company.contact?.email && (
                    <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-20">Email:</dt>
                      <dd className="text-sm text-gray-900 flex-1">
                        <a href={`mailto:${company.contact.email}`} className="text-blue-600 hover:text-blue-800 font-medium">
                          {company.contact.email}
                        </a>
                      </dd>
                    </div>
                  )}
                  {company.contact?.phone && (
                    <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-20">Phone:</dt>
                      <dd className="text-sm text-gray-900 flex-1 flex items-center">
                        <PhoneIcon className="h-4 w-4 text-blue-500 mr-1.5" />
                        <span className="font-medium">{company.contact.phone}</span>
                      </dd>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-20">Website:</dt>
                      <dd className="text-sm text-gray-900 flex-1">
                        <a 
                          href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          <GlobeAltIcon className="h-4 w-4 text-blue-500 mr-1.5" />
                          {company.website.replace(/^https?:\/\//, '')}
                        </a>
                      </dd>
                    </div>
                  )}
                  {company.contact?.linkedin && (
                    <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-20">LinkedIn:</dt>
                      <dd className="text-sm text-gray-900 flex-1">
                        <a 
                          href={company.contact.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                          Company Profile
                        </a>
                      </dd>
                    </div>
                  )}
                  {company.preferredCommunicationChannel && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <dt className="text-sm font-medium text-gray-500 mb-1">Preferred Communication:</dt>
                      <dd className="text-sm text-gray-900">{company.preferredCommunicationChannel}</dd>
                    </div>
                  )}
                </dl>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Talent Needs Section */}
            <div className="bg-white shadow-md overflow-hidden rounded-xl border border-gray-100">
              <div className="px-6 py-5 flex items-center justify-between">
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">Talent Needs</h2>
                </div>
                <div className="flex items-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium bg-blue-600 text-white">
                    {company.hiringGoals}
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 px-6 py-6">
                {company.talentNeeds && company.talentNeeds.length > 0 ? (
                  <div>
                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg mb-6">
                      <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Role</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Count</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Priority</th>
                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Required Skills</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                          {company.talentNeeds.map((need, index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{need.role}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{need.count}</td>
                              <td className="whitespace-nowrap px-3 py-4 text-sm">
                                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${need.priority === 'High' ? 'bg-red-100 text-red-800' : need.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                  {need.priority}
                                </span>
                              </td>
                              <td className="px-3 py-4 text-sm text-gray-500">
                                <div className="flex flex-wrap gap-1">
                                  {need.skills.map((skill, skillIndex) => (
                                    <span key={skillIndex} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <CalendarIcon className="h-5 w-5 text-blue-500 mr-2" />
                          Hiring Timeline
                        </h3>
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <ClockIcon className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-700">
                              <span className="font-medium">Timeline:</span> {company.hiringTimeline}
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                              <span className="font-medium">Budget:</span> {company.hiringBudget}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                        <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                          <DocumentTextIcon className="h-5 w-5 text-blue-500 mr-2" />
                          Decision Making Process
                        </h3>
                        <p className="text-sm text-gray-700">
                          {company.decisionMakingProcess || 'Information not available'}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No specific talent needs information available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Hiring Challenges & Process */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hiring Challenges */}
              <div className="bg-white shadow-md overflow-hidden rounded-xl border border-gray-100">
                <div className="px-6 py-5 flex items-center">
                  <LightBulbIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Hiring Challenges</h2>
                </div>
                <div className="border-t border-gray-100 px-6 py-6">
                  {company.hiringChallenges && company.hiringChallenges.length > 0 ? (
                    <ul className="space-y-3">
                      {company.hiringChallenges.map((challenge, index) => (
                        <li key={index} className="flex items-start">
                          <span className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </span>
                          <span className="text-gray-700">{challenge}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No specific hiring challenges information available.</p>
                  )}
                </div>
              </div>

              {/* Hiring Process */}
              <div className="bg-white shadow-md overflow-hidden rounded-xl border border-gray-100">
                <div className="px-6 py-5 flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                  <h2 className="text-lg font-semibold text-gray-900">Hiring Process</h2>
                </div>
                <div className="border-t border-gray-100 px-6 py-6">
                  {company.hiringProcess && company.hiringProcess.length > 0 ? (
                    <ol className="relative border-l border-gray-200 ml-3 space-y-6">
                      {company.hiringProcess.map((step, index) => (
                        <li key={index} className="mb-6 ml-6">
                          <span className="absolute flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full -left-3 ring-8 ring-white">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </span>
                          <p className="text-gray-700">{step}</p>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500">No specific hiring process information available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Previous Recruiting Experience */}
            <div className="bg-white shadow-md overflow-hidden rounded-xl border border-gray-100">
              <div className="px-6 py-5 flex items-center">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-500 mr-2" />
                <h2 className="text-lg font-semibold text-gray-900">Recruiting Experience & Preferences</h2>
              </div>
              <div className="border-t border-gray-100 px-6 py-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h3 className="text-md font-medium text-gray-900 mb-2">Previous Recruiting Experience</h3>
                  <p className="text-gray-700">{company.previousRecruitingExperience || 'No information available'}</p>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Submit Partnership Proposal
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
