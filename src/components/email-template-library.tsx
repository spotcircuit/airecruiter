'use client';

import { useState } from 'react';
import { 
  EnvelopeIcon,
  DocumentDuplicateIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  TagIcon,
  SparklesIcon,
  BookmarkIcon,
  FireIcon,
  RocketLaunchIcon,
  HeartIcon,
  StarIcon
} from '@heroicons/react/24/outline';

interface EmailTemplate {
  id: string;
  name: string;
  category: 'cold' | 'follow-up' | 'interview' | 'offer' | 'rejection' | 'nurture';
  subject: string;
  body: string;
  variables: string[];
  tags: string[];
  performance?: {
    sent: number;
    opened: number;
    replied: number;
    openRate: number;
    replyRate: number;
  };
  aiGenerated?: boolean;
  favorite?: boolean;
}

export function EmailTemplateLibrary() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditor, setShowEditor] = useState(false);

  // Mock templates
  const templates: EmailTemplate[] = [
    {
      id: '1',
      name: 'Tech Talent Initial Outreach',
      category: 'cold',
      subject: 'Exciting {{role}} opportunity at {{company}}',
      body: `Hi {{firstName}},

I came across your profile and was impressed by your experience with {{skill1}} and {{skill2}}. 

We're working with {{company}}, a {{companyDescription}}, and they're looking for a {{role}} to join their team.

What caught my eye:
• Your work at {{currentCompany}} aligns perfectly with their tech stack
• Your experience with {{relevantProject}} is exactly what they need
• The team culture seems like a great fit for your background

The role offers:
• Competitive salary ({{salaryRange}})
• {{benefit1}}
• {{benefit2}}
• {{benefit3}}

Would you be open to a brief chat this week to discuss further?

Best regards,
{{senderName}}`,
      variables: ['firstName', 'role', 'company', 'skill1', 'skill2', 'companyDescription', 'currentCompany', 'relevantProject', 'salaryRange', 'benefit1', 'benefit2', 'benefit3', 'senderName'],
      tags: ['tech', 'personalized', 'high-performing'],
      performance: {
        sent: 342,
        opened: 267,
        replied: 48,
        openRate: 78,
        replyRate: 14
      },
      favorite: true
    },
    {
      id: '2',
      name: 'Follow-up After No Response',
      category: 'follow-up',
      subject: 'Re: {{role}} opportunity - Quick question',
      body: `Hi {{firstName}},

I wanted to follow up on my previous email about the {{role}} position at {{company}}.

I understand you're busy, so I'll keep this brief:

✓ Remote-first culture
✓ {{uniqueBenefit}}
✓ Working with cutting-edge {{technology}}

If this isn't the right time or fit, no worries at all! I'd love to stay connected for future opportunities.

Quick question: What would your ideal next role look like?

Best,
{{senderName}}`,
      variables: ['firstName', 'role', 'company', 'uniqueBenefit', 'technology', 'senderName'],
      tags: ['follow-up', 'brief', 'engaging'],
      performance: {
        sent: 156,
        opened: 134,
        replied: 31,
        openRate: 86,
        replyRate: 20
      },
      aiGenerated: true
    },
    {
      id: '3',
      name: 'Interview Confirmation',
      category: 'interview',
      subject: 'Interview Confirmed - {{company}} {{role}} - {{date}}',
      body: `Hi {{firstName}},

Great news! Your interview is confirmed:

📅 Date: {{date}}
⏰ Time: {{time}} {{timezone}}
📍 Location: {{location}}
👥 Interviewer(s): {{interviewers}}

What to expect:
• {{interviewFormat}}
• Duration: {{duration}}
• Focus areas: {{focusAreas}}

Preparation tips:
1. Review the job description (attached)
2. Prepare 2-3 questions about the role/company
3. {{specificPrep}}

Need to reschedule? Just let me know ASAP.

Good luck! You've got this! 🚀

Best,
{{senderName}}`,
      variables: ['firstName', 'company', 'role', 'date', 'time', 'timezone', 'location', 'interviewers', 'interviewFormat', 'duration', 'focusAreas', 'specificPrep', 'senderName'],
      tags: ['interview', 'logistics', 'encouraging'],
      performance: {
        sent: 89,
        opened: 87,
        replied: 12,
        openRate: 98,
        replyRate: 13
      }
    },
    {
      id: '4',
      name: 'Passive Candidate Nurture',
      category: 'nurture',
      subject: '{{firstName}}, thought you might find this interesting',
      body: `Hi {{firstName}},

Hope you're doing well! I wanted to share something that might interest you:

{{contentType}}: {{contentTitle}}
{{contentLink}}

Given your experience with {{relevantSkill}}, I thought this might be relevant to your work at {{currentCompany}}.

By the way, the {{industry}} market is really heating up right now. I'm seeing:
• {{trend1}}
• {{trend2}}
• {{trend3}}

If you ever want to explore what's out there (no pressure!), I'm always happy to chat.

Have a great {{dayOfWeek}}!

{{senderName}}`,
      variables: ['firstName', 'contentType', 'contentTitle', 'contentLink', 'relevantSkill', 'currentCompany', 'industry', 'trend1', 'trend2', 'trend3', 'dayOfWeek', 'senderName'],
      tags: ['nurture', 'value-add', 'long-term'],
      performance: {
        sent: 523,
        opened: 412,
        replied: 67,
        openRate: 79,
        replyRate: 13
      },
      favorite: true
    }
  ];

  const categories = [
    { key: 'all', label: 'All Templates', icon: EnvelopeIcon, color: 'gray' },
    { key: 'cold', label: 'Cold Outreach', icon: RocketLaunchIcon, color: 'blue' },
    { key: 'follow-up', label: 'Follow-ups', icon: DocumentDuplicateIcon, color: 'purple' },
    { key: 'interview', label: 'Interview', icon: StarIcon, color: 'green' },
    { key: 'offer', label: 'Offers', icon: HeartIcon, color: 'pink' },
    { key: 'rejection', label: 'Rejections', icon: TrashIcon, color: 'red' },
    { key: 'nurture', label: 'Nurture', icon: FireIcon, color: 'orange' }
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.body.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          template.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.key === category);
    return cat ? `text-${cat.color}-600 bg-${cat.color}-100` : 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <EnvelopeIcon className="h-6 w-6 mr-2 text-indigo-600" />
              Email Template Library
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              High-performing templates with AI personalization
            </p>
          </div>
          <button
            onClick={() => setShowEditor(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <PlusIcon className="h-5 w-5" />
            Create Template
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search templates..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.key}
                onClick={() => setSelectedCategory(category.key)}
                className={`px-3 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  selectedCategory === category.key
                    ? `bg-${category.color}-100 text-${category.color}-700 border-2 border-${category.color}-300`
                    : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-sm font-medium">{category.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
        {/* Template List */}
        <div className="space-y-3">
          <h3 className="font-medium text-gray-900 mb-3">
            {filteredTemplates.length} Templates
          </h3>
          
          {filteredTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => setSelectedTemplate(template)}
              className={`border rounded-lg p-4 cursor-pointer transition-all ${
                selectedTemplate?.id === template.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:shadow-md'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{template.name}</h4>
                    {template.favorite && (
                      <BookmarkIcon className="h-4 w-4 text-yellow-500" />
                    )}
                    {template.aiGenerated && (
                      <SparklesIcon className="h-4 w-4 text-purple-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(template.category)}`}>
                  {template.category}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map((tag, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Performance Metrics */}
              {template.performance && (
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>📤 {template.performance.sent} sent</span>
                  <span>👁 {template.performance.openRate}% open</span>
                  <span>💬 {template.performance.replyRate}% reply</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Template Preview */}
        <div>
          {selectedTemplate ? (
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">Template Preview</h3>
                <div className="flex gap-2">
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900">
                    <DocumentDuplicateIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
                <p className="text-gray-900">{selectedTemplate.subject}</p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Body:</p>
                <div className="whitespace-pre-wrap text-gray-900 text-sm">
                  {selectedTemplate.body}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Variables Used:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedTemplate.variables.map((variable, index) => (
                    <span key={index} className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>

              {selectedTemplate.performance && (
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-green-900 mb-2">Performance Stats</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-green-600">Sent:</span>
                      <span className="ml-2 font-medium text-green-900">{selectedTemplate.performance.sent}</span>
                    </div>
                    <div>
                      <span className="text-green-600">Opened:</span>
                      <span className="ml-2 font-medium text-green-900">{selectedTemplate.performance.opened}</span>
                    </div>
                    <div>
                      <span className="text-green-600">Open Rate:</span>
                      <span className="ml-2 font-medium text-green-900">{selectedTemplate.performance.openRate}%</span>
                    </div>
                    <div>
                      <span className="text-green-600">Reply Rate:</span>
                      <span className="ml-2 font-medium text-green-900">{selectedTemplate.performance.replyRate}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 flex gap-3">
                <button className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                  Use Template
                </button>
                <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Test Send
                </button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">Select a template to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Add missing import
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';