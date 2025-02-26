import { ReactNode } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function AnalyticsLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
