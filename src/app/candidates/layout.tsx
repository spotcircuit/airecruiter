import { ReactNode } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function CandidatesLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
