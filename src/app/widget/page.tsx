'use client';

import { useState } from 'react';
import { ClipboardDocumentIcon, CheckIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

export default function WidgetPage() {
  const [copied, setCopied] = useState(false);
  const [config, setConfig] = useState({
    title: 'Join Our Talent Network',
    subtitle: 'Submit your profile for exciting opportunities',
    job_id: '',
    company_id: ''
  });

  const embedCode = `<!-- AI Recruiter Widget -->
<script>
  window.AIR_WIDGET_CONFIG = {
    title: "${config.title}",
    subtitle: "${config.subtitle}"${config.job_id ? `,
    job_id: "${config.job_id}"` : ''}${config.company_id ? `,
    company_id: "${config.company_id}"` : ''}
  };
</script>
<script src="${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/widget.js" async></script>`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <h1 className="text-3xl font-bold mb-2">Embeddable Candidate Widget</h1>
            <p className="text-purple-100">
              Add a candidate application form to any website with just one line of code
            </p>
          </div>

          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Configure Your Widget</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Widget Title
                  </label>
                  <input
                    type="text"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Widget Subtitle
                  </label>
                  <input
                    type="text"
                    value={config.subtitle}
                    onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.job_id}
                    onChange={(e) => setConfig({ ...config, job_id: e.target.value })}
                    placeholder="Link to specific job"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.company_id}
                    onChange={(e) => setConfig({ ...config, company_id: e.target.value })}
                    placeholder="Link to specific company"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Embed Code</h2>
                <button
                  onClick={copyToClipboard}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  {copied ? (
                    <>
                      <CheckIcon className="h-4 w-4 mr-1 text-green-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-300">
                  <code>{embedCode}</code>
                </pre>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-100 text-purple-600">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">One-Line Integration</h3>
                    <p className="text-sm text-gray-600">Add to any website with a single script tag</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-100 text-purple-600">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Responsive Design</h3>
                    <p className="text-sm text-gray-600">Works perfectly on all devices</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-100 text-purple-600">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Real-time Sync</h3>
                    <p className="text-sm text-gray-600">Submissions appear instantly in your pipeline</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-8 w-8 rounded-md bg-purple-100 text-purple-600">
                      <CheckIcon className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Customizable</h3>
                    <p className="text-sm text-gray-600">Configure title, fields, and branding</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">How It Works</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                <li>Copy the embed code above</li>
                <li>Paste it into your website's HTML (before closing &lt;/body&gt; tag)</li>
                <li>The widget button will appear in the bottom-right corner</li>
                <li>Candidates can click to open the application form</li>
                <li>Submissions are automatically added to your candidate database</li>
              </ol>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600 mb-4">The widget button appears in the bottom-right corner of this page</p>
                <p className="text-sm text-gray-500">Click it to see the candidate form in action!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Load the actual widget on this page for demo */}
      <script dangerouslySetInnerHTML={{ __html: `
        window.AIR_WIDGET_CONFIG = ${JSON.stringify(config)};
      `}} />
      <script src="/widget.js" async />
    </div>
  );
}