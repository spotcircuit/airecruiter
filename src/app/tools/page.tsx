'use client';

import { useState } from 'react';
import { SmartMatcher } from '@/components/smart-matcher';
import { EmailTemplateLibrary } from '@/components/email-template-library';
import { 
  SparklesIcon,
  EnvelopeIcon,
  ChartBarIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

type ToolTab = 'matcher' | 'templates' | 'analytics' | 'boolean';

export default function ToolsPage() {
  const [activeTab, setActiveTab] = useState<ToolTab>('matcher');

  const tools = [
    {
      id: 'matcher' as ToolTab,
      name: 'Smart Matcher',
      description: 'AI-powered candidate matching with explainable scoring',
      icon: SparklesIcon,
      color: 'purple'
    },
    {
      id: 'templates' as ToolTab,
      name: 'Email Templates',
      description: 'High-performing email templates with personalization',
      icon: EnvelopeIcon,
      color: 'indigo'
    },
    {
      id: 'analytics' as ToolTab,
      name: 'Analytics',
      description: 'Track performance metrics and insights',
      icon: ChartBarIcon,
      color: 'green'
    },
    {
      id: 'boolean' as ToolTab,
      name: 'Boolean Builder',
      description: 'Generate advanced search queries from job descriptions',
      icon: MagnifyingGlassIcon,
      color: 'blue'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold flex items-center">
              <BoltIcon className="h-10 w-10 mr-3" />
              AI-Powered Tools
            </h1>
            <p className="text-purple-100 mt-2 text-xl">
              Advanced recruiting tools powered by artificial intelligence
            </p>
          </div>

          {/* Tool Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {tools.map(tool => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setActiveTab(tool.id)}
                  className={`p-4 rounded-lg transition-all ${
                    activeTab === tool.id
                      ? 'bg-white text-gray-900 shadow-lg transform scale-105'
                      : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
                  }`}
                >
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${
                    activeTab === tool.id ? `text-${tool.color}-600` : ''
                  }`} />
                  <h3 className="font-semibold">{tool.name}</h3>
                  <p className={`text-xs mt-1 ${
                    activeTab === tool.id ? 'text-gray-600' : 'text-purple-100'
                  }`}>
                    {tool.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tool Content */}
      <div className="container mx-auto px-4 py-8">
        {activeTab === 'matcher' && (
          <div>
            <SmartMatcher />
            
            {/* Additional Features */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-medium text-gray-900 mb-2">Bulk Matching</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Match hundreds of candidates against multiple job openings simultaneously
                </p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Try Bulk Match →
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-medium text-gray-900 mb-2">Match Analytics</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Analyze matching patterns and improve your criteria over time
                </p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  View Analytics →
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="font-medium text-gray-900 mb-2">AI Recommendations</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Get AI suggestions for improving match rates and candidate quality
                </p>
                <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                  Get Suggestions →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div>
            <EmailTemplateLibrary />
            
            {/* Template Features */}
            <div className="mt-6 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-semibold mb-3">Pro Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-1">A/B Testing</h4>
                  <p className="text-sm text-indigo-100">
                    Test different subject lines and content variations
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">AI Generation</h4>
                  <p className="text-sm text-indigo-100">
                    Generate new templates based on top performers
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Smart Scheduling</h4>
                  <p className="text-sm text-indigo-100">
                    Send emails at optimal times for each recipient
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Analytics Dashboard
            </h2>
            <p className="text-gray-600 mb-6">
              Comprehensive analytics and reporting for your recruiting operations
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-white">
                <p className="text-blue-100 text-sm">Total Placements</p>
                <p className="text-3xl font-bold">287</p>
                <p className="text-sm mt-1">↑ 23% this month</p>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-white">
                <p className="text-green-100 text-sm">Revenue Generated</p>
                <p className="text-3xl font-bold">$1.2M</p>
                <p className="text-sm mt-1">↑ 18% this quarter</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-white">
                <p className="text-purple-100 text-sm">Active Pipelines</p>
                <p className="text-3xl font-bold">142</p>
                <p className="text-sm mt-1">82 BD, 60 Recruiting</p>
              </div>
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-4 text-white">
                <p className="text-orange-100 text-sm">Avg Time to Fill</p>
                <p className="text-3xl font-bold">21d</p>
                <p className="text-sm mt-1">↓ 5 days improved</p>
              </div>
            </div>
            
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Full analytics dashboard available</p>
              <button className="mt-3 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                View Full Analytics
              </button>
            </div>
          </div>
        )}

        {activeTab === 'boolean' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Boolean Query Builder
            </h2>
            <p className="text-gray-600 mb-6">
              Generate advanced search queries for LinkedIn, Google, and other platforms
            </p>
            
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description or Requirements
                </label>
                <textarea
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={6}
                  placeholder="Paste job description or enter requirements..."
                  defaultValue="Looking for a Senior React Developer with 5+ years of experience in TypeScript, Node.js, and AWS. Must have experience with microservices architecture and CI/CD pipelines."
                />
              </div>
              
              <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                <SparklesIcon className="h-5 w-5" />
                Generate Boolean Queries
              </button>
              
              <div className="mt-6 space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">LinkedIn Search</h3>
                  <code className="text-sm text-gray-700 break-all">
                    ("Senior React Developer" OR "Sr React Developer" OR "Lead React Engineer") AND (TypeScript OR "Type Script") AND (Node.js OR NodeJS) AND (AWS OR "Amazon Web Services") AND (microservices OR "micro services") AND (CI/CD OR "continuous integration")
                  </code>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    Copy to clipboard
                  </button>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Google X-Ray Search</h3>
                  <code className="text-sm text-gray-700 break-all">
                    site:linkedin.com/in "React Developer" "TypeScript" "Node.js" "AWS" "microservices" -job -jobs -sample
                  </code>
                  <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                    Copy to clipboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}