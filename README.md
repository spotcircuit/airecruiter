# AI Recruiter Platform

A comprehensive AI-powered recruiting platform with advanced candidate sourcing, company intelligence, and automated outreach capabilities.

## Overview

This project is built with a modern tech stack:
- **Frontend**: Next.js 14 with TypeScript
- **UI Components**: Tailwind CSS with custom components
- **State Management**: Zustand
- **Authentication**: NextAuth.js for email, Google, and LinkedIn SSO
- **Database & Auth**: Supabase (PostgreSQL with built-in auth)
- **AI Services**: OpenAI GPT-3.5/4 for resume parsing, job generation, intelligent matching, and semantic search
- **Payment Integration**: Stripe
- **Scheduling Integration**: Google Calendar

## 🚀 Completed Features

### Core Dashboard
- ✅ Modern responsive dashboard with dark mode support
- ✅ Sidebar navigation with mobile-responsive design
- ✅ Real-time notifications system
- ✅ User authentication with multiple providers

### 📊 Company Intelligence Module
- ✅ **Company Discovery & Search**
  - Advanced hybrid search (keyword + semantic)
  - Industry and size filtering
  - Growth stage tracking
- ✅ **Business Development Pipeline**
  - Kanban board for deal tracking
  - Drag-and-drop stage management
  - Deal value and probability tracking
- ✅ **ICP (Ideal Customer Profile) Builder**
  - Define target company criteria
  - Save and manage multiple ICPs
  - AI-powered company matching
- ✅ **CSV Import/Export**
  - Bulk company data import
  - Export filtered results

### 👥 Candidate Management System
- ✅ **Comprehensive Candidate Profiles**
  - Modal-based detailed view/edit
  - Experience timeline tracking
  - Skills assessment and tagging
  - Salary expectations and availability
- ✅ **Advanced Search Capabilities**
  - Template-based search (form UI)
  - Boolean query builder
  - AI natural language search
  - Semantic similarity matching
- ✅ **Candidate Pipeline (ATS)**
  - Kanban view with stages: Sourced → Contacted → Screening → Submitted → Interviewing → Offer → Hired/Rejected
  - Drag-and-drop candidate management
  - Project/role assignment
  - Rating and scoring system
- ✅ **ICP for Candidates**
  - Define ideal candidate profiles
  - Preset templates (Frontend Dev, Backend Engineer, etc.)
  - Multi-criteria matching (skills, experience, education, location, salary)
- ✅ **Smart Matcher**
  - AI-powered candidate matching with explainable scoring
  - Match explanation with detailed breakdown
  - Configurable matching modes (strict/balanced/flexible)
- ✅ **Resume Parser**
  - PDF and Word document support
  - Automatic field extraction
  - Direct candidate creation from resumes
  - Fallback parsing methods for reliability

### 💼 Jobs Management
- ✅ Job posting creation and management
- ✅ AI-generated job descriptions
- ✅ Application tracking
- ✅ Candidate-job matching

### 📈 Analytics Dashboard
- ✅ Key recruiting metrics
- ✅ Pipeline analytics
- ✅ Conversion rates
- ✅ Time-to-hire tracking

### 🤖 AI-Powered Features
- ✅ Resume parsing with multiple fallback methods
- ✅ Semantic search for candidates and companies
- ✅ AI-generated outreach messages
- ✅ Intelligent candidate-job matching
- ✅ Smart scoring and ranking

## 🔄 In Progress

### Enhanced Contact Management
- Multi-channel contact information
- Email/phone verification
- Contact history tracking
- Preferred contact methods

## 📋 To-Do List

### 1. Project/Pool Management
- [ ] Create project entities for organizing candidates
- [ ] Talent pools for future opportunities
- [ ] Project-specific pipelines
- [ ] Bulk actions for project assignment

### 2. Outreach & Communication
- [ ] Email campaign builder
- [ ] Template library for outreach
- [ ] Automated follow-up sequences
- [ ] Response tracking and analytics
- [ ] LinkedIn InMail integration
- [ ] Email open/click tracking

### 3. Advanced Integrations
- [ ] LinkedIn Recruiter integration
- [ ] Indeed/ZipRecruiter integration
- [ ] Calendar scheduling (Calendly-style)
- [ ] Video interview integration (Zoom/Teams)
- [ ] Background check services
- [ ] HRIS system connectors

### 4. Automation & Workflows
- [ ] Custom workflow builder
- [ ] Automated candidate screening
- [ ] Interview scheduling automation
- [ ] Offer letter generation
- [ ] Onboarding automation
- [ ] Rejection email automation

### 5. Collaboration Features
- [ ] Team assignments
- [ ] Internal notes and comments
- [ ] Candidate sharing between team members
- [ ] Activity feed and audit log
- [ ] Role-based permissions

### 6. Reporting & Analytics Enhancement
- [ ] Custom report builder
- [ ] Diversity metrics
- [ ] Source effectiveness analysis
- [ ] Recruiter performance metrics
- [ ] Cost-per-hire calculations
- [ ] Predictive analytics

### 7. Candidate Experience
- [ ] Candidate portal
- [ ] Application status page
- [ ] Self-scheduling for interviews
- [ ] Document upload portal
- [ ] Feedback collection

### 8. Mobile Experience
- [ ] Progressive Web App (PWA)
- [ ] Mobile-optimized views
- [ ] Push notifications
- [ ] Offline capability

## Getting Started

### Prerequisites
- Node.js (v18 or later)
- npm or yarn
- Supabase account
- OpenAI API key
- Stripe account (for payments)
- Google Calendar API credentials (for scheduling)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/airecruiter.git
cd airecruiter
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Next Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI
OPENAI_API_KEY=your-openai-api-key

# Stripe (optional)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_SECRET_KEY=your-stripe-secret-key

# Google Calendar (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

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

# Run type checking
npm run typecheck

# Run tests
npm run test
```

## Tech Stack Details

### Frontend Architecture
- **Next.js 14**: App Router, Server Components
- **TypeScript**: Full type safety
- **Tailwind CSS**: Utility-first styling
- **Heroicons**: Icon library
- **React Hook Form**: Form management
- **Zod**: Schema validation

### Backend Services
- **Supabase**: PostgreSQL database with Row Level Security
- **NextAuth.js**: Authentication with multiple providers
- **OpenAI API**: GPT-3.5/4 for AI features
- **pdf-parse**: Resume parsing
- **Stripe**: Payment processing

### State Management
- **Zustand**: Global state management
- **React Query**: Server state management
- **Local Storage**: Persistent user preferences

## Deployment

This project is configured for deployment on Vercel with Supabase for database hosting.

1. Push to GitHub
2. Connect repository to Vercel
3. Configure environment variables in Vercel
4. Deploy

## Contributing

Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@airecruiter.com or open an issue in the GitHub repository.