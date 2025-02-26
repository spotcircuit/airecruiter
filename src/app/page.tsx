'use client';

import React from 'react';
import AIWidget from '@/components/AIWidget';
import Link from 'next/link';
import { 
  ChevronRightIcon, 
  CheckCircleIcon, 
  BriefcaseIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AI Recruiter</span>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a href="#features" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400">
                Pricing
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard" 
                className="hidden sm:inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium shadow-sm text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800"
              >
                Dashboard
              </Link>
              <Link 
                href="/dashboard" 
                className="hidden sm:inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-16 pb-24 sm:pb-32">
          {/* Background decorations */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 -z-10"></div>
          <div className="absolute inset-y-0 right-0 -z-10 w-[50%] skew-x-[-15deg] bg-gradient-to-r from-white/0 to-primary-100/30 dark:from-gray-900/0 dark:to-primary-900/20"></div>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-300/50 to-transparent dark:via-primary-700/50"></div>
          
          <div className="absolute hidden lg:block right-0 top-1/4 -z-10">
            <svg viewBox="0 0 200 200" width="400" height="400" xmlns="http://www.w3.org/2000/svg" className="opacity-20 text-primary-400 dark:text-primary-300">
              <path fill="currentColor" d="M67.3,-23.1C75.9,1.7,63.5,32.8,44.8,48.2C26,63.6,0.9,63.2,-21.4,51.8C-43.8,40.3,-63.5,17.8,-62.9,-5.1C-62.4,-27.9,-41.5,-51,-18.2,-59C5.1,-67,58.7,-47.9,67.3,-23.1Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="absolute hidden lg:block left-0 bottom-1/4 -z-10">
            <svg viewBox="0 0 200 200" width="300" height="300" xmlns="http://www.w3.org/2000/svg" className="opacity-20 text-secondary-300 dark:text-secondary-600">
              <path fill="currentColor" d="M36.1,-20.6C52.5,-5.8,75.2,6.9,78.1,22.1C81,37.3,64.2,55.2,44.5,60.9C24.8,66.6,2.2,60.1,-16.9,50.7C-35.9,41.2,-51.3,28.8,-60.4,10C-69.5,-8.8,-72.2,-34.1,-60.4,-46.5C-48.6,-59,-24.3,-58.7,-7.7,-52.8C8.9,-46.9,19.7,-35.5,36.1,-20.6Z" transform="translate(100 100)" />
            </svg>
          </div>
          
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                  <span className="block text-gray-900 dark:text-white">Transform Your</span>
                  <span className="block text-gradient animate-gradient">Hiring Process</span>
                  <span className="block text-gray-900 dark:text-white">With AI</span>
                </h1>
                <p className="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-lg">
                  AI Recruiter streamlines your recruitment workflow, from creating job descriptions to screening candidates and scheduling interviews - all powered by AI.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link 
                    href="/dashboard" 
                    className="btn-primary btn-lg flex items-center justify-center sm:justify-start"
                  >
                    Get Started Free
                    <ChevronRightIcon className="ml-2 h-5 w-5" />
                  </Link>
                  <a 
                    href="#how-it-works" 
                    className="btn-outline btn-lg flex items-center justify-center sm:justify-start"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    Watch Demo
                  </a>
                </div>
                <div className="mt-8 flex items-center space-x-5">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <img 
                        key={i} 
                        src={`https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${20 + i}.jpg`} 
                        className="h-8 w-8 rounded-full border-2 border-white dark:border-gray-800"
                        alt="User avatar"
                      />
                    ))}
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Trusted by 1000+ recruiters</span>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl rotate-3 blur-xl opacity-20"></div>
                <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 sm:p-6 rounded-2xl shadow-xl">
                  <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
                    <div className="w-full h-full flex items-center justify-center p-4">
                      <div className="text-center">
                        <div className="flex justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI Recruiter Dashboard</h3>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Visualize your recruiting pipeline and candidate metrics</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="flex items-center p-3 rounded-lg bg-primary-50 dark:bg-primary-900/30">
                      <div className="flex-shrink-0 p-2 rounded-md bg-primary-100 dark:bg-primary-800">
                        <BriefcaseIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">20+ Job Posts</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Active this month</p>
                      </div>
                    </div>
                    <div className="flex items-center p-3 rounded-lg bg-secondary-50 dark:bg-secondary-900/30">
                      <div className="flex-shrink-0 p-2 rounded-md bg-secondary-100 dark:bg-secondary-800">
                        <UserGroupIcon className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">150+ Candidates</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Processed by AI</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">Features</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Everything you need to hire smarter</p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Our AI-powered platform helps you streamline your recruiting process from start to finish
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="card hover-lift">
                <div className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">AI-Generated Job Descriptions</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Create professional job descriptions in seconds with our AI generator. Just input the basic job details and skills.
                  </p>
                  <div className="mt-6">
                    <Link 
                      href="#" 
                      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium inline-flex items-center"
                    >
                      Learn more
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="card hover-lift">
                <div className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-secondary-100 dark:bg-secondary-900/30 flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Resume Screening & Matching</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Our AI analyzes resumes and ranks candidates based on job requirements and skills, saving you hours of manual screening.
                  </p>
                  <div className="mt-6">
                    <Link 
                      href="#" 
                      className="text-secondary-600 hover:text-secondary-700 dark:text-secondary-400 dark:hover:text-secondary-300 font-medium inline-flex items-center"
                    >
                      Learn more
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="card hover-lift">
                <div className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Interview Scheduling</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Seamlessly schedule interviews with candidates using our integrated calendar system with smart availability detection.
                  </p>
                  <div className="mt-6">
                    <Link 
                      href="#" 
                      className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium inline-flex items-center"
                    >
                      Learn more
                      <ChevronRightIcon className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-base font-semibold text-secondary-600 dark:text-secondary-400 uppercase tracking-wide">How It Works</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Simplify your hiring process</p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Our platform uses AI to streamline every step of the recruitment journey
              </p>
            </div>

            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-12 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary-300 via-secondary-300 to-primary-300 hidden md:block"></div>
              
              <div className="space-y-12">
                {/* Step 1 */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-24 flex justify-center">
                      <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/50 border-4 border-white dark:border-gray-900 flex items-center justify-center z-10">
                        <span className="text-lg font-bold text-primary-600 dark:text-primary-400">1</span>
                      </div>
                    </div>
                    <div className="md:flex-1">
                      <div className="card">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Create Job Postings</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Use our AI-powered job description generator to create compelling job postings in seconds. Just input the basic job details and required skills, and our AI will generate a comprehensive job description.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-24 flex justify-center">
                      <div className="h-12 w-12 rounded-full bg-secondary-100 dark:bg-secondary-900/50 border-4 border-white dark:border-gray-900 flex items-center justify-center z-10">
                        <span className="text-lg font-bold text-secondary-600 dark:text-secondary-400">2</span>
                      </div>
                    </div>
                    <div className="md:flex-1">
                      <div className="card">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Screen Candidates with AI</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Our AI analyzes resumes and ranks candidates based on their match with job requirements. The system highlights relevant skills and experience, helping you quickly identify the best candidates.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="relative">
                  <div className="flex flex-col md:flex-row gap-8">
                    <div className="md:w-24 flex justify-center">
                      <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 border-4 border-white dark:border-gray-900 flex items-center justify-center z-10">
                        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">3</span>
                      </div>
                    </div>
                    <div className="md:flex-1">
                      <div className="card">
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Schedule Interviews</h3>
                          <p className="text-gray-600 dark:text-gray-300 mb-4">
                            Seamlessly schedule interviews with top candidates using our integrated calendar system. Candidates can select times from your availability, and the system automatically sends calendar invites.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 bg-white dark:bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-base font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide">Pricing</h2>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Plans for teams of all sizes</p>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Choose the perfect plan for your hiring needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Starter Plan */}
              <div className="card relative overflow-hidden hover-lift border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Starter</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$49</span>
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Perfect for small businesses or startups</p>
                  
                  <div className="mt-8">
                    <Link 
                      href="/dashboard" 
                      className="btn-outline w-full justify-center"
                    >
                      Get started
                    </Link>
                  </div>
                </div>
              </div>

              {/* Pro Plan */}
              <div className="card relative overflow-hidden hover-lift border-primary-300 dark:border-primary-700 ring-2 ring-primary-500 ring-opacity-20">
                <span className="absolute top-0 right-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </span>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Professional</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$99</span>
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Best for growing teams and businesses</p>
                  
                  <div className="mt-8">
                    <Link 
                      href="/dashboard" 
                      className="btn-primary w-full justify-center"
                    >
                      Get started
                    </Link>
                  </div>
                </div>
              </div>

              {/* Enterprise Plan */}
              <div className="card relative overflow-hidden hover-lift border-gray-200 dark:border-gray-700">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Enterprise</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white">$249</span>
                    <span className="ml-1 text-xl font-semibold text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">For large organizations and high-volume hiring</p>
                  
                  <div className="mt-8">
                    <Link 
                      href="/contact" 
                      className="btn-secondary w-full justify-center"
                    >
                      Contact sales
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-16 sm:py-24">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-600 opacity-90"></div>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to transform your hiring process?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-lg text-white text-opacity-80">
                Start hiring smarter, faster, and more efficiently today.
              </p>
              <div className="mt-8 flex justify-center space-x-4">
                <Link 
                  href="/dashboard" 
                  className="btn-lg bg-white text-primary-700 hover:bg-gray-100"
                >
                  Get Started Free
                </Link>
                <Link 
                  href="/contact" 
                  className="btn-lg bg-transparent text-white border border-white hover:bg-white/10"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="mx-auto max-w-7xl overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
          <nav className="mb-8 columns-2 sm:flex sm:justify-center sm:space-x-12" aria-label="Footer">
            <div className="pb-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">About</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">Features</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">Pricing</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">Blog</a>
            </div>
            <div className="pb-6">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">Contact</a>
            </div>
          </nav>
          <p className="mt-8 text-center text-base text-gray-500 dark:text-gray-400">
            &copy; 2024 AI Recruiter, Inc. All rights reserved.
          </p>
        </div>
      </footer>
      
      {/* AI Chat Widget */}
      <AIWidget />
    </div>
  );
}