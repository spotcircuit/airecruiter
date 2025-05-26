'use client';

import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

type ProposalFormProps = {
  companyName: string;
  companyId: string;
  onClose: () => void;
};

export function PartnershipProposalForm({ companyName, companyId, onClose }: ProposalFormProps) {
  const [formData, setFormData] = useState({
    recruiterName: '',
    recruiterCompany: '',
    recruiterEmail: '',
    recruiterPhone: '',
    serviceOffering: '',
    valueProposition: '',
    successStories: '',
    proposedTerms: '',
    nextSteps: '',
  });
  
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    try {
      // Validate form
      const requiredFields = ['recruiterName', 'recruiterCompany', 'recruiterEmail', 'valueProposition'];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        throw new Error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      }
      
      // TODO: Replace with actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Submitting partnership proposal:', {
        targetCompany: {
          id: companyId,
          name: companyName
        },
        ...formData
      });
      
      setFormStatus('success');
    } catch (error) {
      setFormStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An unexpected error occurred');
    }
  };

  if (formStatus === 'success') {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
        <div className="text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Partnership Proposal Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your partnership proposal to {companyName} has been submitted successfully. 
            We'll notify you when they review your proposal.
          </p>
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Close
            </button>
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              View My Proposals
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Partnership Proposal for {companyName}</h2>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <XCircleIcon className="h-6 w-6" />
        </button>
      </div>
      
      {formStatus === 'error' && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Tips for a Successful Partnership Proposal</h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Focus on how you can solve their specific hiring challenges</li>
            <li>• Highlight your expertise in their industry or technology stack</li>
            <li>• Include concrete examples of past success with similar companies</li>
            <li>• Be clear about your value proposition and differentiation</li>
          </ul>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="recruiterName" className="block text-sm font-medium text-gray-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="recruiterName"
              id="recruiterName"
              value={formData.recruiterName}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="recruiterCompany" className="block text-sm font-medium text-gray-700 mb-1">
              Your Company <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="recruiterCompany"
              id="recruiterCompany"
              value={formData.recruiterCompany}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="recruiterEmail" className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="recruiterEmail"
              id="recruiterEmail"
              value={formData.recruiterEmail}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="recruiterPhone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="recruiterPhone"
              id="recruiterPhone"
              value={formData.recruiterPhone}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="serviceOffering" className="block text-sm font-medium text-gray-700 mb-1">
            Service Offering
          </label>
          <select
            id="serviceOffering"
            name="serviceOffering"
            value={formData.serviceOffering}
            onChange={handleChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="">Select a service</option>
            <option value="Full-service Recruitment">Full-service Recruitment</option>
            <option value="Executive Search">Executive Search</option>
            <option value="Technical Screening">Technical Screening</option>
            <option value="Contract Staffing">Contract Staffing</option>
            <option value="Recruitment Process Outsourcing">Recruitment Process Outsourcing</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="valueProposition" className="block text-sm font-medium text-gray-700 mb-1">
            Value Proposition <span className="text-red-500">*</span>
          </label>
          <textarea
            id="valueProposition"
            name="valueProposition"
            rows={4}
            value={formData.valueProposition}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="How can you help solve their specific hiring challenges? What makes your service unique?"
            required
          />
        </div>
        
        <div>
          <label htmlFor="successStories" className="block text-sm font-medium text-gray-700 mb-1">
            Relevant Success Stories
          </label>
          <textarea
            id="successStories"
            name="successStories"
            rows={3}
            value={formData.successStories}
            onChange={handleChange}
            className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder="Share examples of how you've helped similar companies"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="proposedTerms" className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Terms
            </label>
            <textarea
              id="proposedTerms"
              name="proposedTerms"
              rows={3}
              value={formData.proposedTerms}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Fee structure, timeline, guarantees, etc."
            />
          </div>
          
          <div>
            <label htmlFor="nextSteps" className="block text-sm font-medium text-gray-700 mb-1">
              Proposed Next Steps
            </label>
            <textarea
              id="nextSteps"
              name="nextSteps"
              rows={3}
              value={formData.nextSteps}
              onChange={handleChange}
              className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Suggest a meeting, demo, or other next steps"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={formStatus === 'submitting'}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {formStatus === 'submitting' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Proposal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
