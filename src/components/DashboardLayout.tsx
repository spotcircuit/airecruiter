'use client';

import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import { useUIStore } from '@/store';
import { SunIcon, MoonIcon, Bars3Icon } from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { theme, toggleTheme, sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar />

      <div className={`flex flex-1 flex-col transition-all duration-300 ${sidebarOpen ? 'lg:pl-72' : ''}`}>
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md dark:bg-gray-800/80 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <button
                type="button"
                className="lg:hidden inline-flex items-center justify-center rounded-md p-2 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-primary-900/30 dark:text-primary-400 dark:hover:bg-primary-900/50"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                <span className="sr-only">Open sidebar</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </button>
              
              <div className="hidden md:block ml-4">
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200">Welcome, Sarah!</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Let's find your next top talent</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search bar */}
              <div className="hidden md:block relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                  </svg>
                </div>
                <input 
                  type="search" 
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" 
                  placeholder="Search candidates, jobs..." 
                />
              </div>
              
              {/* Notification button */}
              <button className="relative p-2 text-gray-600 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700">
                <span className="sr-only">View notifications</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary-500"></div>
              </button>
              
              {/* Theme toggle */}
              <button
                type="button"
                className="rounded-full p-2 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={toggleTheme}
              >
                <span className="sr-only">Toggle theme</span>
                {theme === 'light' ? (
                  <MoonIcon className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <SunIcon className="h-6 w-6" aria-hidden="true" />
                )}
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  type="button"
                  className="flex items-center rounded-full border-2 border-primary-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:border-primary-800 dark:bg-gray-800"
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt="User profile"
                  />
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
        
        {/* Optional footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2024 AI Recruiter. All rights reserved.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Privacy
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Terms
              </a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                Help
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
