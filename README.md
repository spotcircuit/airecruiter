# AI Recruiter

An AI-powered recruiting assistant that includes a recruiter dashboard and an embedded AI widget for candidates.

## Overview

This project is built with a modern tech stack:
- **Frontend**: Next.js with TypeScript
- **UI Components**: Tailwind CSS
- **State Management**: Zustand
- **Authentication**: NextAuth.js for email, Google, and LinkedIn SSO
- **Database & Auth**: Supabase (PostgreSQL with built-in auth)
- **AI Services**: OpenAI GPT-5 nano with Responses API for advanced reasoning, resume parsing, job generation, and intelligent matching
- **Payment Integration**: Stripe
- **Scheduling Integration**: Google Calendar

## Features

### Recruiter Dashboard
- Navigation Sidebar with sections for Home, Jobs, Candidates, Analytics, Settings
- Job Posting Management with AI-generated job descriptions
- Candidate Screening & Matching with AI-generated ranking scores
- Analytics Dashboard with hiring trends and metrics

### Embedded AI Widget
- Chatbot-like design with resume upload functionality
- Job recommendations based on candidate profiles
- Application status tracking
- AI Chatbot for common questions

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account
- Google Calendar API credentials

### Installation

1. Clone the repository
2. Install dependencies
3. Set up environment variables
4. Run the development server

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Run tests
npm run test
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI (GPT-5 nano)
OPENAI_API_KEY=your-openai-api-key
OPENAI_ORGANIZATION_ID=your-openai-org-id
OPENAI_MODEL=gpt-5-nano

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret

# Google Calendar
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Deployment

This project is configured for deployment on Vercel with Supabase for database hosting.
