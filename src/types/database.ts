// Database Types for AI Recruiter

export type DealStage = 'prospect' | 'discovery' | 'proposal' | 'won' | 'lost';
export type JobStatus = 'draft' | 'published' | 'closed';
export type SubmissionStatus = 'draft' | 'sent' | 'interview' | 'offer' | 'rejected';
export type ActivityType = 'email' | 'note' | 'call' | 'status' | 'meeting' | 'task';
export type SequenceChannel = 'email' | 'sms' | 'linkedin';
export type SequenceRunState = 'pending' | 'sent' | 'replied' | 'stopped' | 'completed';
export type PartnerStatus = 'lead' | 'prospect' | 'active' | 'inactive' | 'churned';
export type CandidateStage = 'new' | 'screening' | 'shortlisted' | 'interviewed' | 'offered' | 'hired' | 'rejected';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  industry?: string;
  size?: string;
  location?: string;
  headquarters?: string;
  description?: string;
  signals?: Record<string, any>;
  partner_status: PartnerStatus;
  hiring_urgency?: string;
  hiring_volume?: number;
  growth_stage?: string;
  funding_amount?: number;
  website_url?: string;
  linkedin_url?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Contact {
  id: string;
  company_id?: string;
  first_name: string;
  last_name?: string;
  full_name?: string;
  title?: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  is_primary: boolean;
  do_not_contact: boolean;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Deal {
  id: string;
  company_id?: string;
  name: string;
  stage: DealStage;
  value?: number;
  probability?: number;
  owner_id?: string;
  next_step?: string;
  close_date?: Date;
  notes?: string;
  lost_reason?: string;
  created_at: Date;
  updated_at: Date;
  closed_at?: Date;
}

export interface Job {
  id: string;
  company_id?: string;
  title: string;
  department?: string;
  location?: string;
  location_type?: string;
  employment_type?: string;
  experience_level?: string;
  salary_min?: number;
  salary_max?: number;
  salary_currency: string;
  jd_text?: string;
  requirements?: string[];
  nice_to_haves?: string[];
  benefits?: string[];
  status: JobStatus;
  urgency?: string;
  openings: number;
  embedding?: number[];
  published_at?: Date;
  closed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Candidate {
  id: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  email: string;
  phone?: string;
  location?: string;
  current_title?: string;
  current_company?: string;
  years_experience?: number;
  resume_url?: string;
  resume_text?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  skills?: string[];
  education?: any[];
  experience?: any[];
  source?: string;
  source_details?: Record<string, any>;
  notes?: string;
  tags?: string[];
  embedding?: number[];
  willing_to_relocate?: boolean;
  expected_salary_min?: number;
  expected_salary_max?: number;
  notice_period?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Submission {
  id: string;
  job_id?: string;
  candidate_id?: string;
  match_score?: number;
  match_reasons?: any[];
  brief_md?: string;
  status: SubmissionStatus;
  stage: CandidateStage;
  rejection_reason?: string;
  notes?: string;
  submitted_at?: Date;
  interviewed_at?: Date;
  offered_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Activity {
  id: string;
  actor_id?: string;
  subject_type: string;
  subject_id: string;
  related_type?: string;
  related_id?: string;
  type: ActivityType;
  title?: string;
  description?: string;
  payload?: Record<string, any>;
  is_automated: boolean;
  occurred_at: Date;
  created_at: Date;
}

export interface Sequence {
  id: string;
  name: string;
  description?: string;
  channel: SequenceChannel;
  is_active: boolean;
  steps: SequenceStep[];
  settings?: Record<string, any>;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SequenceStep {
  order: number;
  delay_days: number;
  template: {
    subject?: string;
    body: string;
    variables?: string[];
  };
  conditions?: Record<string, any>;
}

export interface SequenceRun {
  id: string;
  sequence_id?: string;
  contact_id?: string;
  deal_id?: string;
  state: SequenceRunState;
  current_step: number;
  last_event?: Record<string, any>;
  personalization_data?: Record<string, any>;
  started_at?: Date;
  completed_at?: Date;
  stopped_at?: Date;
  stop_reason?: string;
  metrics?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export interface ICP {
  id: string;
  name: string;
  industry?: string;
  geography?: string;
  company_size_min?: number;
  company_size_max?: number;
  tech_keywords?: string[];
  hiring_signals?: string[];
  other_criteria?: Record<string, any>;
  is_active: boolean;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ScreeningQuestion {
  id: string;
  job_id?: string;
  question: string;
  question_type: 'text' | 'boolean' | 'choice' | 'scale';
  options?: string[];
  is_required: boolean;
  is_knockout: boolean;
  expected_answer?: string;
  order_index: number;
  created_at: Date;
}

export interface ScreeningResponse {
  id: string;
  submission_id?: string;
  question_id?: string;
  answer?: string;
  is_correct?: boolean;
  answered_at: Date;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject?: string;
  body: string;
  variables?: string[];
  category?: string;
  is_active: boolean;
  created_by?: string;
  created_at: Date;
  updated_at: Date;
}

// Joined types for common queries
export interface ContactWithCompany extends Contact {
  company?: Company;
}

export interface DealWithCompany extends Deal {
  company?: Company;
}

export interface JobWithCompany extends Job {
  company?: Company;
}

export interface SubmissionWithDetails extends Submission {
  job?: Job;
  candidate?: Candidate;
  company?: Company;
}

export interface SequenceRunWithDetails extends SequenceRun {
  sequence?: Sequence;
  contact?: Contact;
  deal?: Deal;
}