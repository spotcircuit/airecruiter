'use client';

import { useState } from 'react';
import { EmailSequencer } from '@/components/email-sequencer';
import { ReplyMonitor } from '@/components/reply-monitor';
import { 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  SparklesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function SequencesPage() {
  const [activeSequenceId, setActiveSequenceId] = useState<string | undefined>();
  const [showSequencer, setShowSequencer] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex justify-between items-start mb-3">
            <h1 className="text-4xl font-bold">Email Sequences</h1>
            <button
              onClick={() => setShowSequencer(true)}
              className="px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition-all flex items-center gap-2 font-medium"
            >
              <EnvelopeIcon className="h-5 w-5" />
              Create Sequence
            </button>
          </div>
          <p className="text-green-100 mb-8 text-xl max-w-3xl">
            Automate your outreach with AI-powered email sequences and intelligent reply detection
          </p>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <SparklesIcon className="h-8 w-8 text-white mb-2" />
              <h3 className="text-lg font-semibold mb-1">AI Personalization</h3>
              <p className="text-green-100 text-sm">
                Each email is uniquely personalized using AI based on recipient data
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-white mb-2" />
              <h3 className="text-lg font-semibold mb-1">Reply Detection</h3>
              <p className="text-green-100 text-sm">
                Automatically detect replies and stop sequences when prospects engage
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <ChartBarIcon className="h-8 w-8 text-white mb-2" />
              <h3 className="text-lg font-semibold mb-1">Intent Classification</h3>
              <p className="text-green-100 text-sm">
                AI classifies reply intent: interested, not interested, questions, or OOO
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Sequences */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-green-600" />
                Active Sequences
              </h2>
              
              {/* Mock sequence list */}
              <div className="space-y-3">
                {[
                  { id: '1', name: 'Enterprise Outreach Q1', contacts: 150, replies: 23, status: 'active' },
                  { id: '2', name: 'SaaS Partnership Campaign', contacts: 87, replies: 12, status: 'active' },
                  { id: '3', name: 'Healthcare Vertical', contacts: 45, replies: 8, status: 'paused' }
                ].map(sequence => (
                  <div 
                    key={sequence.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => setActiveSequenceId(sequence.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{sequence.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{sequence.contacts} contacts</span>
                          <span className="text-green-600">{sequence.replies} replies</span>
                          <span className="text-blue-600">
                            {((sequence.replies / sequence.contacts) * 100).toFixed(1)}% reply rate
                          </span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        sequence.status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sequence.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Detection Features */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">🎯 Reply Detection Features</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>Automatically stops sequence when a reply is detected</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>Classifies intent: Interested, Not Interested, Questions, Out of Office</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>Suggests next actions based on reply sentiment</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircleIcon className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0 text-blue-600" />
                    <span>Handles unsubscribe requests automatically</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reply Monitor */}
          <div className="lg:col-span-1">
            <ReplyMonitor sequenceId={activeSequenceId} compactMode={false} />
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How Reply Detection Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">1</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Send Sequence</h3>
              <p className="text-sm text-gray-600">
                AI personalizes and sends emails to your contacts
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">2</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Monitor Inbox</h3>
              <p className="text-sm text-gray-600">
                System monitors for incoming replies continuously
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">3</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Analyze Intent</h3>
              <p className="text-sm text-gray-600">
                AI classifies the reply type and sentiment
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold">4</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">Take Action</h3>
              <p className="text-sm text-gray-600">
                Stop sequence and notify you with recommended next steps
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Email Sequencer Modal */}
      {showSequencer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Create Email Sequence</h2>
                <button
                  onClick={() => setShowSequencer(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <EmailSequencer />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add missing import
import { CheckCircleIcon } from '@heroicons/react/24/outline';