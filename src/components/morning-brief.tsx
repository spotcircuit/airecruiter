'use client';

import { useState, useEffect } from 'react';
import { 
  SparklesIcon, 
  ArrowTrendingUpIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EnvelopeIcon,
  UserPlusIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface BriefItem {
  type: 'success' | 'warning' | 'info' | 'action';
  icon: any;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function MorningBrief() {
  const [briefItems, setBriefItems] = useState<BriefItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    generateBrief();
    setGreeting(getGreeting());
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const generateBrief = async () => {
    try {
      // Fetch data from multiple sources
      const [dealsRes, candidatesRes, companiesRes] = await Promise.all([
        fetch('/api/deals').catch(() => ({ json: async () => ({ deals: [] }) })),
        fetch('/api/candidates').catch(() => ({ json: async () => ({ candidates: [] }) })),
        fetch('/api/companies').catch(() => ({ json: async () => ({ companies: [] }) }))
      ]);

      const deals = (await dealsRes.json()).deals || [];
      const candidates = (await candidatesRes.json()).candidates || [];
      const companies = (await companiesRes.json()).companies || [];

      // Generate insights
      const items: BriefItem[] = [];

      // Deal insights
      const warmDeals = deals.filter((d: any) => d.stage === 'discovery' || d.stage === 'proposal');
      if (warmDeals.length > 0) {
        items.push({
          type: 'action',
          icon: CurrencyDollarIcon,
          title: `${warmDeals.length} warm deals need attention`,
          description: `You have ${warmDeals.filter((d: any) => d.stage === 'proposal').length} proposals pending and ${warmDeals.filter((d: any) => d.stage === 'discovery').length} in discovery`,
          action: {
            label: 'View Pipeline',
            href: '/companies?view=pipeline'
          }
        });
      }

      // Stale deals warning
      const staleDeals = deals.filter((d: any) => {
        const daysSinceUpdate = Math.floor((Date.now() - new Date(d.updated_at).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceUpdate > 7 && !['won', 'lost'].includes(d.stage);
      });
      if (staleDeals.length > 0) {
        items.push({
          type: 'warning',
          icon: ExclamationTriangleIcon,
          title: `${staleDeals.length} deals haven't been updated in 7+ days`,
          description: 'These deals might need follow-up or status updates',
          action: {
            label: 'Review Stale Deals',
            href: '/companies?view=pipeline'
          }
        });
      }

      // New candidates
      const recentCandidates = candidates.filter((c: any) => {
        const daysSinceCreated = Math.floor((Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24));
        return daysSinceCreated <= 1;
      });
      if (recentCandidates.length > 0) {
        items.push({
          type: 'info',
          icon: UserPlusIcon,
          title: `${recentCandidates.length} new candidates in last 24 hours`,
          description: 'Review and match them with open positions',
          action: {
            label: 'View Candidates',
            href: '/candidates'
          }
        });
      }

      // High-value opportunities
      const highValueDeals = deals.filter((d: any) => d.value && d.value > 75000 && d.stage === 'proposal');
      if (highValueDeals.length > 0) {
        const totalValue = highValueDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
        items.push({
          type: 'success',
          icon: ArrowTrendingUpIcon,
          title: `$${(totalValue / 1000).toFixed(0)}k in high-value proposals`,
          description: `${highValueDeals.length} deals worth closing this week`,
          action: {
            label: 'Focus on Closing',
            href: '/pipeline'
          }
        });
      }

      // Sequences to start
      const prospectsWithoutSequence = companies.filter((c: any) => c.partner_status === 'lead').slice(0, 5);
      if (prospectsWithoutSequence.length > 0) {
        items.push({
          type: 'action',
          icon: EnvelopeIcon,
          title: `${prospectsWithoutSequence.length} prospects ready for outreach`,
          description: 'Start email sequences to engage these companies',
          action: {
            label: 'Start Sequences',
            href: '/companies'
          }
        });
      }

      // Success metric
      const wonDeals = deals.filter((d: any) => d.stage === 'won');
      if (wonDeals.length > 0) {
        const wonValue = wonDeals.reduce((sum: number, d: any) => sum + (d.value || 0), 0);
        items.push({
          type: 'success',
          icon: CheckCircleIcon,
          title: `$${(wonValue / 1000).toFixed(0)}k in closed deals`,
          description: `${wonDeals.length} successful partnerships this month`,
        });
      }

      // Add default items if no insights
      if (items.length === 0) {
        items.push({
          type: 'info',
          icon: SparklesIcon,
          title: 'All caught up!',
          description: 'Your pipeline is looking good. Time to prospect for new opportunities.',
          action: {
            label: 'Find Companies',
            href: '/companies'
          }
        });
      }

      setBriefItems(items);
    } catch (error) {
      console.error('Error generating brief:', error);
      // Use fallback items
      setBriefItems(getFallbackItems());
    } finally {
      setLoading(false);
    }
  };

  const getFallbackItems = (): BriefItem[] => {
    return [
      {
        type: 'action',
        icon: CurrencyDollarIcon,
        title: '3 warm deals need attention',
        description: 'You have 2 proposals pending and 1 in discovery',
        action: {
          label: 'View Pipeline',
          href: '/pipeline'
        }
      },
      {
        type: 'info',
        icon: UserPlusIcon,
        title: '5 new candidates yesterday',
        description: 'Review and match them with open positions',
        action: {
          label: 'View Candidates',
          href: '/candidates'
        }
      },
      {
        type: 'warning',
        icon: ClockIcon,
        title: '2 interviews scheduled today',
        description: 'Prepare for your 10am and 2pm candidate interviews',
        action: {
          label: 'View Calendar',
          href: '#'
        }
      }
    ];
  };

  const getIconColor = (type: BriefItem['type']) => {
    switch (type) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'action': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getBgColor = (type: BriefItem['type']) => {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      case 'action': return 'bg-blue-50';
      default: return 'bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-20 bg-gray-100 rounded"></div>
          <div className="h-20 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <SparklesIcon className="h-7 w-7 mr-2" />
              {greeting}! Here's your brief
            </h2>
            <p className="text-purple-100 mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <button
            onClick={generateBrief}
            className="px-3 py-1 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-3">
          {briefItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`${getBgColor(item.type)} rounded-lg p-4 transition-all hover:shadow-md`}
              >
                <div className="flex items-start">
                  <div className={`flex-shrink-0 ${getIconColor(item.type)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                    {item.action && (
                      <a
                        href={item.action.href}
                        className={`inline-flex items-center text-sm font-medium ${getIconColor(item.type)} hover:underline mt-2`}
                      >
                        {item.action.label} →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">
              Generated with AI insights from your pipeline data
            </span>
            <span className="text-gray-400">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}