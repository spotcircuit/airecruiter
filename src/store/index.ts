'use client';

import { create } from 'zustand';
import { User, Job, Candidate, Application } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setIsLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface JobState {
  jobs: Job[];
  selectedJob: Job | null;
  isLoading: boolean;
  error: string | null;
  setJobs: (jobs: Job[]) => void;
  setSelectedJob: (job: Job | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addJob: (job: Job) => void;
  updateJob: (job: Job) => void;
  deleteJob: (jobId: string) => void;
}

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  selectedJob: null,
  isLoading: false,
  error: null,
  setJobs: (jobs) => set({ jobs }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (job) => set((state) => ({
    jobs: state.jobs.map((j) => (j.id === job.id ? job : j)),
  })),
  deleteJob: (jobId) => set((state) => ({
    jobs: state.jobs.filter((j) => j.id !== jobId),
  })),
}));

interface CandidateState {
  candidates: Candidate[];
  selectedCandidate: Candidate | null;
  isLoading: boolean;
  error: string | null;
  setCandidates: (candidates: Candidate[]) => void;
  setSelectedCandidate: (candidate: Candidate | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addCandidate: (candidate: Candidate) => void;
  updateCandidate: (candidate: Candidate) => void;
  deleteCandidate: (candidateId: string) => void;
}

export const useCandidateStore = create<CandidateState>((set) => ({
  candidates: [],
  selectedCandidate: null,
  isLoading: false,
  error: null,
  setCandidates: (candidates) => set({ candidates }),
  setSelectedCandidate: (candidate) => set({ selectedCandidate: candidate }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addCandidate: (candidate) => set((state) => ({ candidates: [...state.candidates, candidate] })),
  updateCandidate: (candidate) => set((state) => ({
    candidates: state.candidates.map((c) => (c.id === candidate.id ? candidate : c)),
  })),
  deleteCandidate: (candidateId) => set((state) => ({
    candidates: state.candidates.filter((c) => c.id !== candidateId),
  })),
}));

interface ApplicationState {
  applications: Application[];
  selectedApplication: Application | null;
  isLoading: boolean;
  error: string | null;
  setApplications: (applications: Application[]) => void;
  setSelectedApplication: (application: Application | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  addApplication: (application: Application) => void;
  updateApplication: (application: Application) => void;
  deleteApplication: (applicationId: string) => void;
}

export const useApplicationStore = create<ApplicationState>((set) => ({
  applications: [],
  selectedApplication: null,
  isLoading: false,
  error: null,
  setApplications: (applications) => set({ applications }),
  setSelectedApplication: (application) => set({ selectedApplication: application }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addApplication: (application) => set((state) => ({ applications: [...state.applications, application] })),
  updateApplication: (application) => set((state) => ({
    applications: state.applications.map((a) => (a.id === application.id ? application : a)),
  })),
  deleteApplication: (applicationId) => set((state) => ({
    applications: state.applications.filter((a) => a.id !== applicationId),
  })),
}));

interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'light',
  sidebarOpen: true,
  setTheme: (theme) => set({ theme }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
