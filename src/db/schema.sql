-- AI Recruiter Database Schema
-- For Neon PostgreSQL with pgvector extension

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enums for various statuses
CREATE TYPE deal_stage AS ENUM ('prospect', 'discovery', 'proposal', 'won', 'lost');
CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed');
CREATE TYPE submission_status AS ENUM ('draft', 'sent', 'interview', 'offer', 'rejected');
CREATE TYPE activity_type AS ENUM ('email', 'note', 'call', 'status', 'meeting', 'task');
CREATE TYPE sequence_channel AS ENUM ('email', 'sms', 'linkedin');
CREATE TYPE sequence_run_state AS ENUM ('pending', 'sent', 'replied', 'stopped', 'completed');
CREATE TYPE partner_status AS ENUM ('lead', 'prospect', 'active', 'inactive', 'churned');

-- Companies table (BD targets)
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE,
    industry VARCHAR(100),
    size VARCHAR(50), -- e.g., "1-10", "11-50", "51-200", etc.
    location VARCHAR(255),
    headquarters VARCHAR(255),
    description TEXT,
    signals JSONB DEFAULT '{}', -- enrichment data, hiring signals, tech stack, etc.
    partner_status partner_status DEFAULT 'lead',
    hiring_urgency VARCHAR(50), -- high, medium, low
    hiring_volume INTEGER,
    growth_stage VARCHAR(50), -- seed, series-a, growth, enterprise
    funding_amount DECIMAL(15, 2),
    website_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Contacts table (people at companies)
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100),
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || COALESCE(last_name, '')) STORED,
    title VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    is_primary BOOLEAN DEFAULT false,
    do_not_contact BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Deals table (BD pipeline)
CREATE TABLE deals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    stage deal_stage DEFAULT 'prospect',
    value DECIMAL(12, 2),
    probability INTEGER CHECK (probability >= 0 AND probability <= 100),
    owner_id UUID, -- Will reference users table when auth is implemented
    next_step TEXT,
    close_date DATE,
    notes TEXT,
    lost_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP WITH TIME ZONE
);

-- Jobs table (recruiting positions)
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(255),
    location_type VARCHAR(50), -- remote, hybrid, onsite
    employment_type VARCHAR(50), -- full-time, part-time, contract
    experience_level VARCHAR(50), -- entry, mid, senior, executive
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    jd_text TEXT,
    requirements TEXT[],
    nice_to_haves TEXT[],
    benefits TEXT[],
    status job_status DEFAULT 'draft',
    urgency VARCHAR(50), -- high, medium, low
    openings INTEGER DEFAULT 1,
    embedding vector(1536), -- for semantic search
    published_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Candidates table
CREATE TABLE candidates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    full_name VARCHAR(255) GENERATED ALWAYS AS (COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')) STORED,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    location VARCHAR(255),
    current_title VARCHAR(255),
    current_company VARCHAR(255),
    years_experience INTEGER,
    resume_url VARCHAR(500),
    resume_text TEXT, -- parsed text from resume
    linkedin_url VARCHAR(500),
    github_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    skills TEXT[],
    education JSONB DEFAULT '[]', -- array of education objects
    experience JSONB DEFAULT '[]', -- array of experience objects
    source VARCHAR(100), -- linkedin, indeed, referral, website, etc.
    source_details JSONB,
    notes TEXT,
    tags TEXT[],
    embedding vector(1536), -- for semantic matching
    willing_to_relocate BOOLEAN,
    expected_salary_min DECIMAL(10, 2),
    expected_salary_max DECIMAL(10, 2),
    notice_period VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Submissions table (candidate-job matches)
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
    match_score DECIMAL(5, 2), -- 0-100 percentage
    match_reasons JSONB DEFAULT '[]', -- array of reason objects
    brief_md TEXT, -- markdown formatted candidate brief
    status submission_status DEFAULT 'draft',
    stage VARCHAR(50) DEFAULT 'new', -- new, screening, shortlisted, interviewed, offered, hired, rejected
    rejection_reason TEXT,
    notes TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE,
    interviewed_at TIMESTAMP WITH TIME ZONE,
    offered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, candidate_id)
);

-- Activities table (unified activity log)
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID, -- user who performed the action
    subject_type VARCHAR(50) NOT NULL, -- company, contact, candidate, job, deal, submission
    subject_id UUID NOT NULL,
    related_type VARCHAR(50), -- optional related entity
    related_id UUID, -- optional related entity id
    type activity_type NOT NULL,
    title VARCHAR(255),
    description TEXT,
    payload JSONB DEFAULT '{}', -- flexible data for different activity types
    is_automated BOOLEAN DEFAULT false,
    occurred_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sequences table (email/outreach campaigns)
CREATE TABLE sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    channel sequence_channel DEFAULT 'email',
    is_active BOOLEAN DEFAULT true,
    steps JSONB NOT NULL, -- array of step objects with templates, delays, etc.
    settings JSONB DEFAULT '{}', -- reply detection, personalization settings, etc.
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sequence Runs table (track sequence execution per contact)
CREATE TABLE sequence_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sequence_id UUID REFERENCES sequences(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
    deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
    state sequence_run_state DEFAULT 'pending',
    current_step INTEGER DEFAULT 0,
    last_event JSONB, -- details of last action/event
    personalization_data JSONB DEFAULT '{}', -- AI-generated personalization fields
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    stopped_at TIMESTAMP WITH TIME ZONE,
    stop_reason VARCHAR(255),
    metrics JSONB DEFAULT '{}', -- opens, clicks, replies, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(sequence_id, contact_id)
);

-- ICP (Ideal Customer Profile) table
CREATE TABLE icps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    geography VARCHAR(255),
    company_size_min INTEGER,
    company_size_max INTEGER,
    tech_keywords TEXT[],
    hiring_signals TEXT[],
    other_criteria JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Screening Questions table
CREATE TABLE screening_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    question_type VARCHAR(50) DEFAULT 'text', -- text, boolean, choice, scale
    options TEXT[], -- for choice questions
    is_required BOOLEAN DEFAULT true,
    is_knockout BOOLEAN DEFAULT false,
    expected_answer TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Screening Responses table
CREATE TABLE screening_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES submissions(id) ON DELETE CASCADE,
    question_id UUID REFERENCES screening_questions(id) ON DELETE CASCADE,
    answer TEXT,
    is_correct BOOLEAN,
    answered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(submission_id, question_id)
);

-- Email Templates table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(500),
    body TEXT NOT NULL,
    variables TEXT[], -- list of variable names used in template
    category VARCHAR(50), -- outreach, screening, scheduling, etc.
    is_active BOOLEAN DEFAULT true,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_companies_domain ON companies(domain);
CREATE INDEX idx_companies_partner_status ON companies(partner_status);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_contacts_company_id ON contacts(company_id);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_deals_company_id ON deals(company_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_owner_id ON deals(owner_id);
CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_candidates_email ON candidates(email);
CREATE INDEX idx_candidates_source ON candidates(source);
CREATE INDEX idx_submissions_job_id ON submissions(job_id);
CREATE INDEX idx_submissions_candidate_id ON submissions(candidate_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_activities_subject ON activities(subject_type, subject_id);
CREATE INDEX idx_activities_occurred_at ON activities(occurred_at DESC);
CREATE INDEX idx_sequence_runs_contact_id ON sequence_runs(contact_id);
CREATE INDEX idx_sequence_runs_state ON sequence_runs(state);

-- Vector similarity indexes (for semantic search)
CREATE INDEX idx_jobs_embedding ON jobs USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX idx_candidates_embedding ON candidates USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON candidates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequences_updated_at BEFORE UPDATE ON sequences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sequence_runs_updated_at BEFORE UPDATE ON sequence_runs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_icps_updated_at BEFORE UPDATE ON icps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();