'use client';

import React from 'react';
import { NotificationProvider } from '@/contexts/NotificationContext';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>AI Recruiter</title>
        <meta name="description" content="AI-powered recruiting assistant with a recruiter dashboard and an embedded AI widget for candidates" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Add Inter font using Google Fonts standard approach */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans">
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </body>
    </html>
  );
}