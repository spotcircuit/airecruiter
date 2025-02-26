// User types
export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  role: 'recruiter' | 'admin' | 'candidate';
  created_at: string;
}

// Job types
export interface Job {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary_range?: string;
  experience_level: string;
  skills: string[];
  status: 'draft' | 'published' | 'closed';
  created_at: string;
  updated_at: string;
  created_by: string;
}

// Candidate types
export interface Candidate {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  resume_url?: string;
  linkedin_url?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  match_score?: number;
  status: 'new' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  title: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date?: string;
  current: boolean;
}

// Application types
export interface Application {
  id: string;
  job_id: string;
  candidate_id: string;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'interviewed' | 'offered' | 'rejected';
  match_score: number;
  created_at: string;
  updated_at: string;
}

// Interview types
export interface Interview {
  id: string;
  application_id: string;
  recruiter_id: string;
  candidate_id: string;
  job_id: string;
  date: string;
  duration: number; // in minutes
  location?: string;
  video_link?: string;
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Analytics types
export interface AnalyticsData {
  total_jobs: number;
  total_candidates: number;
  total_applications: number;
  time_to_fill: number; // average days to fill a position
  conversion_rate: number; // percentage of applications that result in hires
  diversity_metrics: DiversityMetrics;
  hiring_trends: HiringTrend[];
}

export interface DiversityMetrics {
  gender: Record<string, number>;
  ethnicity: Record<string, number>;
  age_groups: Record<string, number>;
}

export interface HiringTrend {
  month: string;
  applications: number;
  interviews: number;
  hires: number;
}

// AI Widget types
export interface AIWidget {
  id: string;
  company_id: string;
  name: string;
  theme: 'light' | 'dark' | 'auto';
  primary_color: string;
  logo_url?: string;
  welcome_message: string;
  created_at: string;
  updated_at: string;
}
