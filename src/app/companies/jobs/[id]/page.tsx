import { notFound } from 'next/navigation';
import { ArrowLeftIcon, MapPinIcon, CurrencyDollarIcon, BriefcaseIcon, ClockIcon, BuildingOfficeIcon, LinkIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

// Mock data - replace with actual API call
const getJobDetails = (id: string) => {
  const jobs = [
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechStart Inc.',
      location: 'San Francisco, CA (Remote)',
      salary: '$120,000 - $150,000',
      type: 'Full-time',
      experience: '5+ years',
      postedDate: '2 days ago',
      description: 'We are looking for an experienced Frontend Developer to join our growing team. You will be responsible for building user interfaces and implementing features for our web applications using modern JavaScript frameworks.',
      responsibilities: [
        'Develop new user-facing features using React.js',
        'Build reusable components and front-end libraries for future use',
        'Translate designs and wireframes into high-quality code',
        'Optimize components for maximum performance across a vast array of web-capable devices and browsers',
        'Collaborate with product team and graphic designers'
      ],
      requirements: [
        '5+ years of experience with JavaScript, including DOM manipulation and the JavaScript object model',
        'Thorough understanding of React.js and its core principles',
        'Experience with popular React.js workflows (such as Redux)',
        'Familiarity with newer specifications of EcmaScript',
        'Experience with data structure libraries (e.g., Immutable.js)'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        '401(k) with company match',
        'Flexible work hours and remote work options',
        'Professional development budget',
        'Unlimited vacation policy'
      ],
      companyDescription: 'TechStart Inc. is a leading technology company specializing in innovative software solutions. We build products that help businesses grow and succeed in the digital age. Our team is passionate about creating exceptional user experiences and solving complex problems.',
      companySize: '51-200 employees',
      companyWebsite: 'https://techstart.example.com',
      isFeatured: true,
      applicationUrl: 'https://apply.techstart.example.com/jobs/1/apply'
    },
    {
      id: '2',
      title: 'Product Manager',
      company: 'TechStart Inc.',
      location: 'San Francisco, CA',
      salary: '$130,000 - $160,000',
      type: 'Full-time',
      experience: '3+ years',
      postedDate: '1 week ago',
      description: 'We are seeking a talented Product Manager to drive the development of our core products and features.',
      responsibilities: [],
      requirements: [],
      benefits: [],
      companyDescription: '',
      companySize: '51-200 employees',
      companyWebsite: 'https://techstart.example.com',
      isFeatured: false,
      applicationUrl: 'https://apply.techstart.example.com/jobs/2/apply'
    },
    {
      id: '3',
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'New York, NY (Hybrid)',
      salary: '$90,000 - $120,000',
      type: 'Full-time',
      experience: '3+ years',
      postedDate: '3 days ago',
      description: 'Join our design team to create beautiful and intuitive user experiences for our products.',
      responsibilities: [],
      requirements: [],
      benefits: [],
      companyDescription: '',
      companySize: '11-50 employees',
      companyWebsite: 'https://designhub.example.com',
      isFeatured: true,
      applicationUrl: 'https://apply.designhub.example.com/jobs/3/apply'
    },
  ];

  return jobs.find(job => job.id === id);
};

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const job = getJobDetails(params.id);

  if (!job) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            href="/companies/jobs" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back to jobs
          </Link>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                <p className="mt-1 text-lg text-gray-600">{job.company}</p>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <BriefcaseIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-1.5" />
                    Posted {job.postedDate}
                  </div>
                </div>
                
                {job.isFeatured && (
                  <span className="inline-flex items-center mt-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Featured
                  </span>
                )}
              </div>
              <div className="mt-4 sm:mt-0">
                <a
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Apply now
                </a>
                <p className="mt-2 text-xs text-gray-500 text-center">
                  You'll be redirected to {new URL(job.applicationUrl).hostname}
                </p>
              </div>
            </div>
          </div>

          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="prose max-w-none">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                  <p className="text-gray-700 mb-6">{job.description}</p>

                  {job.responsibilities && job.responsibilities.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Responsibilities</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {job.responsibilities.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.requirements && job.requirements.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Requirements</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {job.requirements.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {job.benefits && job.benefits.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Benefits</h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {job.benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <a
                    href={job.applicationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Apply for this position
                  </a>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">About {job.company}</h3>
                  <p className="text-gray-700 mb-4">{job.companyDescription || 'No company description available.'}</p>
                  
                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Company size</h4>
                      <p className="text-sm text-gray-900">{job.companySize}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Experience level</h4>
                      <p className="text-sm text-gray-900">{job.experience}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Employment type</h4>
                      <p className="text-sm text-gray-900">{job.type}</p>
                    </div>
                    
                    {job.companyWebsite && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Website</h4>
                        <a 
                          href={job.companyWebsite.startsWith('http') ? job.companyWebsite : `https://${job.companyWebsite}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800 inline-flex items-center"
                        >
                          {job.companyWebsite.replace(/^https?:\/\//, '')}
                          <LinkIcon className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Similar Jobs</h3>
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                        <h4 className="font-medium text-gray-900">Senior Backend Developer</h4>
                        <p className="text-sm text-gray-600">TechStart Inc.</p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                          Remote
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            $120k - $150k
                          </span>
                        </div>
                      </div>
                    ))}
                    <div className="mt-4">
                      <a href="/companies/jobs" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                        View all jobs at {job.company}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
