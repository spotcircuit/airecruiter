'use client';

import { useState, useRef } from 'react';
import { 
  ChatBubbleLeftRightIcon, 
  PaperClipIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

interface AIWidgetProps {
  companyName?: string;
  logoUrl?: string;
  welcomeMessage?: string;
}

export default function AIWidget({
  companyName = 'AI Recruiter',
  logoUrl = '/logo.svg',
  welcomeMessage = 'Hello! I\'m your AI recruiting assistant. Upload your resume or ask me questions about job opportunities.',
}: AIWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: welcomeMessage },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    const newMessages = [
      ...messages,
      { role: 'user' as const, content: inputValue },
    ];
    setMessages(newMessages);
    setInputValue('');

    // Simulate AI response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        {
          role: 'assistant' as const,
          content: 'Thank you for your message. Our team will review your inquiry and get back to you shortly.',
        },
      ]);
    }, 1000);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setMessages([
      ...messages,
      { role: 'user', content: `Uploading resume: ${file.name}` },
    ]);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      // Simulate API call
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            role: 'assistant',
            content: 'Thank you for uploading your resume. I\'ve analyzed it and found several matching positions for your skills and experience.',
          },
        ]);
        setIsUploading(false);
      }, 2000);
    } catch (error) {
      console.error('Error uploading resume:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: 'assistant',
          content: 'Sorry, there was an error processing your resume. Please try again later.',
        },
      ]);
      setIsUploading(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen 
            ? 'bg-white text-primary-600 rotate-90' 
            : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white'
        }`}
      >
        {isOpen ? (
          <XMarkIcon className="h-8 w-8" />
        ) : (
          <div className="relative">
            <ChatBubbleLeftRightIcon className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex h-4 w-4 rounded-full bg-primary-500"></span>
            </span>
          </div>
        )}
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div
          className={`fixed bottom-24 right-6 z-50 w-80 sm:w-[400px] overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 transform ${
            isDarkMode ? 'dark bg-gray-900' : 'bg-white'
          } border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}
          style={{ maxHeight: 'calc(100vh - 120px)' }}
        >
          {/* Header */}
          <div
            className={`relative overflow-hidden ${
              isDarkMode ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 opacity-10"></div>
            
            <div className="px-6 py-4 relative flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md">
                  {logoUrl ? (
                    <img src={logoUrl} alt={companyName} className="h-6 w-6" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{companyName}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">AI Assistant</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={toggleDarkMode}
                  className={`rounded-full p-2 ${
                    isDarkMode
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } transition-colors`}
                >
                  {isDarkMode ? (
                    <SunIcon className="h-5 w-5" />
                  ) : (
                    <MoonIcon className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className={`rounded-full p-2 ${
                    isDarkMode
                      ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                  } transition-colors`}
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div
            className={`h-[350px] overflow-y-auto p-6 space-y-4 ${
              isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'
            }`}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
                <div
                  className={`relative max-w-[75%] px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-t-xl rounded-bl-xl'
                      : isDarkMode
                      ? 'bg-gray-800 text-white rounded-t-xl rounded-br-xl'
                      : 'bg-white text-gray-800 shadow-sm rounded-t-xl rounded-br-xl border border-gray-200'
                  }`}
                >
                  {message.content}
                  <div className="mt-1 text-right">
                    <span className={`text-xs ${message.role === 'user' ? 'text-primary-100' : 'text-gray-500'}`}>
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                {message.role === 'user' && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isUploading && (
              <div className="flex justify-start">
                <div className="flex-shrink-0 mr-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div
                  className={`relative max-w-[75%] rounded-t-xl rounded-br-xl px-4 py-3 ${
                    isDarkMode
                      ? 'bg-gray-800 text-white'
                      : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="h-2 w-2 rounded-full bg-primary-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-primary-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="h-2 w-2 rounded-full bg-primary-600 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm">Analyzing your resume...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Suggested questions */}
          {!isUploading && (
            <div className={`px-6 py-3 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <p className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Suggested questions:
              </p>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    setInputValue('What jobs match my skills?');
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full ${
                    isDarkMode 
                      ? 'bg-gray-800 text-primary-400 hover:bg-gray-750' 
                      : 'bg-white text-primary-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  What jobs match my skills?
                </button>
                <button 
                  onClick={() => {
                    setInputValue('Help me prepare for an interview');
                    setTimeout(() => handleSendMessage(), 100);
                  }}
                  className={`text-xs px-3 py-1.5 rounded-full ${
                    isDarkMode 
                      ? 'bg-gray-800 text-primary-400 hover:bg-gray-750' 
                      : 'bg-white text-primary-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  Help me prepare for an interview
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <div
            className={`px-4 py-3 ${
              isDarkMode
                ? 'bg-gray-800 border-t border-gray-700'
                : 'bg-white border-t border-gray-200'
            }`}
          >
            <div className="flex items-center">
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`rounded-full p-2 transition-colors ${
                  isDarkMode
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-primary-600'
                }`}
                title="Upload resume"
              >
                <PaperClipIcon className="h-5 w-5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
                className="hidden"
              />
              <div className="relative flex-1 mx-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Type a message..."
                  className={`w-full rounded-full border px-4 py-2 pr-10 focus:outline-none ${
                    isDarkMode
                      ? 'border-gray-600 bg-gray-700 text-white focus:border-primary-500'
                      : 'border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'
                  }`}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={inputValue.trim() === ''}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-1.5 ${
                    inputValue.trim() === '' 
                      ? 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed opacity-50' 
                      : 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white hover:from-primary-700 hover:to-secondary-700'
                  } transition-colors`}
                >
                  <PaperAirplaneIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Powered by AI Recruiter • <a href="#" className="underline hover:text-primary-600 dark:hover:text-primary-400">Privacy Policy</a>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
