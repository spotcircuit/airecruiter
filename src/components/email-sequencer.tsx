'use client';

import { useState, useEffect } from 'react';
import { EnvelopeIcon, SparklesIcon, PlayIcon, PauseIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  title?: string;
  company_name?: string;
}

interface SequenceStep {
  order: number;
  delay_days: number;
  subject: string;
  body: string;
  personalization_fields?: string[];
}

export function EmailSequencer({ companyId, dealId }: { companyId?: string; dealId?: string }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [sequenceName, setSequenceName] = useState('BD Outreach Campaign');
  const [steps, setSteps] = useState<SequenceStep[]>([
    {
      order: 1,
      delay_days: 0,
      subject: 'Partnership opportunity with {{company_name}}',
      body: `Hi {{first_name}},

I noticed {{company_name}} is {{hiring_signal}}. We specialize in helping companies like yours scale their teams efficiently.

{{value_prop}}

Would you be open to a brief call next week to discuss how we could help with your hiring needs?

Best regards,
{{sender_name}}`,
      personalization_fields: ['company_name', 'first_name', 'hiring_signal', 'value_prop', 'sender_name']
    },
    {
      order: 2,
      delay_days: 3,
      subject: 'Following up - Recruitment partnership',
      body: `Hi {{first_name}},

I wanted to follow up on my previous email about helping {{company_name}} with your talent acquisition.

{{case_study}}

I'd love to share how we've helped similar companies reduce time-to-hire by 40%.

Are you available for a quick call this week?

Best,
{{sender_name}}`,
      personalization_fields: ['first_name', 'company_name', 'case_study', 'sender_name']
    },
    {
      order: 3,
      delay_days: 7,
      subject: 'Final check-in',
      body: `Hi {{first_name}},

I understand you might be busy. I'll keep this brief.

If hiring isn't a priority right now, I completely understand. 

If it becomes one in the future, I'd be happy to chat about how we can help {{company_name}} build an exceptional team.

Best wishes,
{{sender_name}}`,
      personalization_fields: ['first_name', 'company_name', 'sender_name']
    }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [preview, setPreview] = useState<{ subject: string; body: string } | null>(null);

  useEffect(() => {
    if (companyId) {
      fetchContacts();
    }
  }, [companyId]);

  const fetchContacts = async () => {
    try {
      const response = await fetch(`/api/contacts?company_id=${companyId}`);
      const data = await response.json();
      setContacts(data.contacts || []);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      // Use mock data for demo
      setContacts([
        {
          id: '1',
          first_name: 'John',
          last_name: 'Smith',
          email: 'john.smith@example.com',
          title: 'VP of Engineering',
          company_name: 'TechCorp Solutions'
        },
        {
          id: '2',
          first_name: 'Sarah',
          last_name: 'Johnson',
          email: 'sarah.johnson@example.com',
          title: 'Head of Talent',
          company_name: 'TechCorp Solutions'
        }
      ]);
    }
  };

  const generatePersonalization = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/personalize-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contacts: contacts.filter(c => selectedContacts.includes(c.id)),
          sequence_steps: steps,
          company_id: companyId
        })
      });
      
      const data = await response.json();
      if (data.personalized_steps) {
        setSteps(data.personalized_steps);
      }
    } catch (error) {
      console.error('Error generating personalization:', error);
      // Simulate AI personalization
      simulatePersonalization();
    } finally {
      setIsGenerating(false);
    }
  };

  const simulatePersonalization = () => {
    const personalizedSteps = steps.map(step => ({
      ...step,
      body: step.body
        .replace('{{hiring_signal}}', 'rapidly expanding your engineering team')
        .replace('{{value_prop}}', 'Our network includes over 10,000 pre-vetted senior engineers, and we typically fill roles in under 3 weeks')
        .replace('{{case_study}}', 'We recently helped CloudScale Infrastructure hire 15 engineers in just 6 weeks')
        .replace('{{sender_name}}', 'Your Name')
    }));
    setSteps(personalizedSteps);
  };

  const startSequence = async () => {
    if (selectedContacts.length === 0) {
      alert('Please select at least one contact');
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/sequences/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sequence_name: sequenceName,
          contact_ids: selectedContacts,
          deal_id: dealId,
          steps: steps
        })
      });
      
      if (response.ok) {
        alert(`Sequence started for ${selectedContacts.length} contacts!`);
        setSelectedContacts([]);
      }
    } catch (error) {
      console.error('Error starting sequence:', error);
      alert('Demo: Sequence would be started for selected contacts');
    } finally {
      setIsSending(false);
    }
  };

  const previewEmail = (step: SequenceStep) => {
    const personalized = {
      subject: step.subject
        .replace('{{company_name}}', contacts[0]?.company_name || 'Your Company')
        .replace('{{first_name}}', contacts[0]?.first_name || 'there'),
      body: step.body
        .replace(/{{first_name}}/g, contacts[0]?.first_name || 'there')
        .replace(/{{company_name}}/g, contacts[0]?.company_name || 'Your Company')
        .replace('{{hiring_signal}}', 'rapidly expanding your engineering team')
        .replace('{{value_prop}}', 'Our network includes over 10,000 pre-vetted senior engineers')
        .replace('{{case_study}}', 'We recently helped CloudScale Infrastructure hire 15 engineers')
        .replace(/{{sender_name}}/g, 'Your Name')
    };
    setPreview(personalized);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email Sequence Builder</h3>
            <p className="text-sm text-gray-600 mt-1">Create personalized outreach campaigns with AI</p>
          </div>
          <button
            onClick={generatePersonalization}
            disabled={isGenerating}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="h-4 w-4 mr-1" />
                AI Personalize
              </>
            )}
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sequence Name
          </label>
          <input
            type="text"
            value={sequenceName}
            onChange={(e) => setSequenceName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {contacts.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Contacts ({selectedContacts.length} selected)
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
              {contacts.map(contact => (
                <label key={contact.id} className="flex items-center p-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedContacts.includes(contact.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedContacts([...selectedContacts, contact.id]);
                      } else {
                        setSelectedContacts(selectedContacts.filter(id => id !== contact.id));
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {contact.first_name} {contact.last_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {contact.title} • {contact.email}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Sequence Steps</h4>
        
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-semibold text-sm">
                    {step.order}
                  </div>
                  <div className="ml-3">
                    <span className="text-sm font-medium text-gray-900">
                      {step.delay_days === 0 ? 'Immediately' : `Day ${step.delay_days}`}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => previewEmail(step)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Preview
                </button>
              </div>
              
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
                  <input
                    type="text"
                    value={step.subject}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[index].subject = e.target.value;
                      setSteps(newSteps);
                    }}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Body</label>
                  <textarea
                    value={step.body}
                    onChange={(e) => {
                      const newSteps = [...steps];
                      newSteps[index].body = e.target.value;
                      setSteps(newSteps);
                    }}
                    rows={4}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {step.personalization_fields && step.personalization_fields.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {step.personalization_fields.map(field => (
                      <span key={field} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {`{{${field}}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between">
          <button
            onClick={() => setSteps([...steps, {
              order: steps.length + 1,
              delay_days: 7 * steps.length,
              subject: 'Follow up',
              body: 'Follow up message...',
              personalization_fields: []
            }])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            + Add Step
          </button>
          
          <button
            onClick={startSequence}
            disabled={isSending || selectedContacts.length === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {isSending ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Starting...
              </>
            ) : (
              <>
                <PlayIcon className="h-4 w-4 mr-1" />
                Start Sequence
              </>
            )}
          </button>
        </div>
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setPreview(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto m-4" onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Preview</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-500">Subject:</span>
                  <p className="text-sm text-gray-900 mt-1">{preview.subject}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Body:</span>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{preview.body}</p>
                </div>
              </div>
              <button
                onClick={() => setPreview(null)}
                className="mt-4 w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}