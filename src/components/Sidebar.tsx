'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon, 
  BriefcaseIcon, 
  UserGroupIcon, 
  ChartBarIcon, 
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { useUIStore } from '@/store';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: HomeIcon,
    description: 'Overview of recruiting metrics' 
  },
  { 
    name: 'Jobs', 
    href: '/jobs', 
    icon: BriefcaseIcon,
    description: 'Manage open positions' 
  },
  { 
    name: 'Candidates', 
    href: '/candidates', 
    icon: UserGroupIcon,
    description: 'View and manage applicants' 
  },
  { 
    name: 'Companies', 
    href: '/companies', 
    icon: BuildingOfficeIcon,
    description: 'Find actively hiring companies' 
  },
  { 
    name: 'Analytics', 
    href: '/analytics', 
    icon: ChartBarIcon,
    description: 'Recruiting performance metrics' 
  },
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Cog6ToothIcon,
    description: 'Customize your experience' 
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 z-40 flex items-center p-4">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 bg-white/90 shadow-md text-gray-700 hover:bg-gray-100 hover:text-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800/90 dark:text-gray-300 dark:hover:text-primary-400"
          onClick={() => setMobileMenuOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />

          <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-white dark:bg-gray-900 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 sm:border-r sm:border-gray-200 dark:sm:border-gray-700">
            <div className="relative">
              {/* Mobile menu header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div className="ml-3">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Recruiter</h1>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Smart hiring solutions</p>
                  </div>
                </div>
                <button
                  type="button"
                  className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-gray-800"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>
              
              {/* Mobile menu navigation */}
              <nav className="px-4 py-6">
                <div className="space-y-2">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                          isActive 
                            ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md' 
                            : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                        }`}
                      >
                        <div className={`${isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                          <item.icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className={`text-base font-medium ${isActive ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                            {item.name}
                          </p>
                          <p className={`text-xs ${isActive ? 'text-white text-opacity-80' : 'text-gray-500 dark:text-gray-400'}`}>
                            {item.description}
                          </p>
                        </div>
                        {isActive && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </nav>
              
              {/* Quick actions for mobile */}
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    New Job
                  </button>
                  <button className="flex items-center justify-center px-4 py-3 text-sm font-medium bg-secondary-50 text-secondary-700 rounded-lg hover:bg-secondary-100 dark:bg-secondary-900/30 dark:text-secondary-400 dark:hover:bg-secondary-900/50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Draft Email
                  </button>
                </div>
              </div>
              
              {/* User profile for mobile */}
              <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                  <img
                    className="h-10 w-10 rounded-full border-2 border-primary-300 dark:border-primary-700"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Sarah Johnson</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Recruiter</p>
                  </div>
                  <button className="ml-auto text-primary-600 hover:text-primary-800 text-sm font-medium dark:text-primary-400 dark:hover:text-primary-300">
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-72 transform shadow-xl transition duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col bg-white dark:bg-gray-900 relative overflow-hidden">
          {/* Gradient background effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 z-0"></div>
          
          <div className="relative z-10">
            {/* Header with logo */}
            <div className="relative px-6 py-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">AI Recruiter</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Smart hiring solutions</p>
                </div>
              </div>
              <button
                type="button"
                className="lg:hidden absolute right-4 top-6 rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:hover:bg-gray-800"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            
            {/* Navigation */}
            <nav className="mt-6 flex-1 px-3 pb-6">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                        isActive 
                          ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md' 
                          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400'}`}>
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="ml-3 flex-1">
                        <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-900 group-hover:text-gray-900 dark:text-gray-100'}`}>
                          {item.name}
                        </p>
                        <p className={`text-xs ${isActive ? 'text-white text-opacity-80' : 'text-gray-500 dark:text-gray-400'}`}>
                          {item.description}
                        </p>
                      </div>
                      {isActive && (
                        <div className="ml-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
              
              {/* Quick Actions */}
              <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Quick Actions
                </h3>
                <div className="mt-2 space-y-1">
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Job Post
                  </button>
                  <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg dark:text-gray-300 dark:hover:bg-gray-800">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Draft Email
                  </button>
                </div>
              </div>
            </nav>
          </div>
          
          {/* User Profile Section */}
          <div className="relative z-10 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center p-4">
              <img
                className="h-10 w-10 rounded-full border-2 border-primary-300 dark:border-primary-800"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="User profile"
              />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Sarah Johnson</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Recruiter</p>
              </div>
              <button className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
