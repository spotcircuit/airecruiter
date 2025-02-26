import { 
  BriefcaseIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  ClockIcon,
  ChartBarIcon,
  LightBulbIcon,
  UserIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';

const stats = [
  { 
    name: 'Active Jobs', 
    value: '12', 
    icon: BriefcaseIcon, 
    change: '+2', 
    changeType: 'increase',
    gradient: 'from-blue-500 to-cyan-400',
    description: 'Open positions currently accepting applicants'
  },
  { 
    name: 'Candidates', 
    value: '245', 
    icon: UserGroupIcon, 
    change: '+30', 
    changeType: 'increase',
    gradient: 'from-violet-500 to-purple-500',
    description: 'Total candidate profiles in your database'
  },
  { 
    name: 'Applications', 
    value: '156', 
    icon: DocumentTextIcon, 
    change: '+18', 
    changeType: 'increase',
    gradient: 'from-green-400 to-emerald-500',
    description: 'Job applications received across all positions'
  },
  { 
    name: 'Avg. Time to Fill', 
    value: '24 days', 
    icon: ClockIcon, 
    change: '-3', 
    changeType: 'decrease',
    gradient: 'from-amber-400 to-orange-500',
    description: 'Average days from posting to hiring'
  },
];

const recentCandidates = [
  { 
    id: '1', 
    name: 'John Smith', 
    position: 'Frontend Developer', 
    status: 'Shortlisted', 
    matchScore: 92,
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    skills: ['React', 'TypeScript', 'Tailwind CSS'],
    education: 'M.S. Computer Science, Stanford University'
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    position: 'UX Designer', 
    status: 'New', 
    matchScore: 88,
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    skills: ['Figma', 'User Research', 'Prototyping'],
    education: 'B.A. Digital Design, Rhode Island School of Design'
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    position: 'Backend Developer', 
    status: 'Interviewed', 
    matchScore: 85,
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    skills: ['Node.js', 'Python', 'PostgreSQL'],
    education: 'B.S. Computer Science, MIT'
  },
  { 
    id: '4', 
    name: 'Emily Davis', 
    position: 'Product Manager', 
    status: 'New', 
    matchScore: 79,
    avatar: 'https://randomuser.me/api/portraits/women/67.jpg',
    skills: ['Agile', 'Strategic Planning', 'User Stories'],
    education: 'MBA, Harvard Business School'
  },
  { 
    id: '5', 
    name: 'David Wilson', 
    position: 'DevOps Engineer', 
    status: 'Shortlisted', 
    matchScore: 76,
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    skills: ['AWS', 'Docker', 'Kubernetes'],
    education: 'B.S. Information Systems, UC Berkeley'
  },
];

const upcomingInterviews = [
  {
    id: '1',
    candidateName: 'John Smith',
    position: 'Frontend Developer',
    date: 'June 15, 2024',
    time: '10:00 AM',
    type: 'Technical Interview'
  },
  {
    id: '2',
    candidateName: 'Michael Brown',
    position: 'Backend Developer',
    date: 'June 16, 2024',
    time: '2:30 PM',
    type: 'Second Round'
  },
  {
    id: '3',
    candidateName: 'David Wilson',
    position: 'DevOps Engineer',
    date: 'June 17, 2024',
    time: '11:15 AM',
    type: 'Final Interview'
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-10 rounded-lg"></div>
        <div className="relative px-6 py-8 rounded-lg">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
            Welcome back! Here's an overview of your recruiting activities
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="overflow-hidden rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          >
            <div className="px-4 pt-5 pb-2">
              <div className="flex items-start">
                <div className={`flex-shrink-0 p-2 rounded-lg bg-gradient-to-br ${stat.gradient} bg-opacity-20`}>
                  <stat.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {stat.name}
                  </dt>
                  <dd>
                    <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">
                      {stat.value}
                    </div>
                  </dd>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{stat.description}</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 dark:bg-gray-700/50">
              <div className="text-sm flex items-center">
                {stat.changeType === 'increase' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                )}
                <span
                  className={`ml-1 font-medium ${
                    stat.changeType === 'increase'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </span>{' '}
                <span className="ml-1 text-gray-500 dark:text-gray-400">from last month</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Candidates */}
        <div className="lg:col-span-2 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-2 text-primary-600 dark:text-primary-400" />
                  Top Candidates
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Highest matching candidates for your current openings
                </p>
              </div>
              <button className="px-3 py-1 text-sm font-medium text-primary-700 bg-primary-100 rounded-md hover:bg-primary-200 dark:bg-primary-900 dark:text-primary-300 dark:hover:bg-primary-800 transition-colors">
                View All
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentCandidates.map((candidate) => (
              <div key={candidate.id} className="p-5 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex items-start">
                  <img 
                    src={candidate.avatar} 
                    alt={candidate.name} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-primary-300 dark:border-primary-700"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-medium text-gray-900 dark:text-white">{candidate.name}</h3>
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          candidate.status === 'New'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : candidate.status === 'Shortlisted'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        }`}
                      >
                        {candidate.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{candidate.position}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{candidate.education}</p>
                    
                    <div className="mt-2">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                          <div
                            className="h-2 rounded-full bg-gradient-to-r from-green-400 to-primary-500"
                            style={{ width: `${candidate.matchScore}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          {candidate.matchScore}%
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex flex-wrap gap-1">
                      {candidate.skills.map((skill, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-50 px-5 py-3 dark:bg-gray-700 text-center">
            <a href="#" className="text-sm font-medium text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300">
              View all candidates
            </a>
          </div>
        </div>

        {/* Upcoming Interviews */}
        <div className="lg:col-span-1 overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-secondary-50 to-secondary-100 dark:from-gray-800 dark:to-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-secondary-600 dark:text-secondary-400" />
                  Upcoming Interviews
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Your scheduled interviews
                </p>
              </div>
              <button className="px-3 py-1 text-sm font-medium text-secondary-700 bg-secondary-100 rounded-md hover:bg-secondary-200 dark:bg-secondary-900 dark:text-secondary-300 dark:hover:bg-secondary-800 transition-colors">
                Schedule
              </button>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {upcomingInterviews.map((interview) => (
              <div key={interview.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{interview.candidateName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{interview.position}</p>
                    <div className="mt-1 flex items-center">
                      <div className="flex-shrink-0">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <p className="ml-1 text-xs text-gray-500">{interview.date} at {interview.time}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {interview.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="bg-gray-50 px-5 py-3 dark:bg-gray-700 text-center">
            <a href="#" className="text-sm font-medium text-secondary-600 hover:text-secondary-800 dark:text-secondary-400 dark:hover:text-secondary-300">
              View all interviews
            </a>
          </div>
        </div>
      </div>

      {/* AI Assistant Panel */}
      <div className="rounded-xl overflow-hidden bg-gradient-to-r from-primary-700 to-secondary-700 shadow-lg">
        <div className="px-6 py-5 text-white">
          <div className="flex items-start">
            <div className="flex-shrink-0 bg-white bg-opacity-20 p-3 rounded-lg">
              <LightBulbIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-white">AI Recruiting Assistant</h2>
              <p className="mt-1 text-white text-opacity-80">
                Your AI assistant can help optimize job descriptions, screen candidates, and schedule interviews.
              </p>
              <div className="mt-4 flex space-x-3">
                <button className="px-4 py-2 bg-white text-primary-700 font-medium rounded-md hover:bg-opacity-90 transition-colors">
                  Generate Job Description
                </button>
                <button className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-colors">
                  Screen Resumes
                </button>
                <button className="px-4 py-2 bg-white bg-opacity-20 text-white font-medium rounded-md hover:bg-opacity-30 transition-colors">
                  Draft Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="overflow-hidden rounded-xl bg-white shadow-md dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
        <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-gray-600 dark:text-gray-400" />
                Recent Activity
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Latest actions and updates in your recruiting pipeline
              </p>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          <div className="p-4 flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                <span className="font-medium">Sarah Johnson</span> was added to the <span className="font-medium">UX Designer</span> shortlist
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <BriefcaseIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                New job posting created: <span className="font-medium">Senior React Developer</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday</p>
            </div>
          </div>
          
          <div className="p-4 flex items-center">
            <div className="flex-shrink-0 h-10 w-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <DocumentTextIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-900 dark:text-gray-100">
                <span className="font-medium">15 new applications</span> received for <span className="font-medium">Frontend Developer</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">2 days ago</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 px-5 py-3 dark:bg-gray-700 text-center">
          <a href="#" className="text-sm font-medium text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300">
            View all activity
          </a>
        </div>
      </div>
    </div>
  );
}
