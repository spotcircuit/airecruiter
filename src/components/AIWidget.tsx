'use client';

import React, { useState } from 'react';

export default function AIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg bg-blue-500 text-white hover:bg-blue-600"
      >
        AI
      </button>

      {/* Chat widget */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 rounded-lg shadow-xl bg-white border border-gray-200 overflow-hidden">
          <div className="p-4 bg-blue-500 text-white">
            <h3 className="font-medium">AI Assistant</h3>
          </div>
          <div className="p-4">
            <p className="text-gray-700">Hello! I'm your AI recruiting assistant. How can I help you?</p>
          </div>
        </div>
      )}
    </>
  );
}