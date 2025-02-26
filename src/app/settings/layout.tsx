import { ReactNode } from 'react';
import DashboardLayout from '@/components/DashboardLayout';

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
