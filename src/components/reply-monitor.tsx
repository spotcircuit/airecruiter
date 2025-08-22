'use client';

import { useState, useEffect } from 'react';
import { 
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  FaceSmileIcon,
  FaceFrownIcon
} from '@heroicons/react/24/outline';

interface Reply {
  id: string;
  contact_email: string;
  first_name: string;
  last_name: string;
  created_at: string;
  metadata?: {
    replyType: string;
    sentiment: string;
    confidence: number;
    suggestedAction: string;
  };
  description: string;
}

interface ReplyMonitorProps {
  sequenceId?: string;
  compactMode?: boolean;
}

export function ReplyMonitor({ sequenceId, compactMode = false }: ReplyMonitorProps) {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [stats, setStats] = useState({
    totalActive: 0,
    totalReplies: 0,
    replyRate: '0%'
  });
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (sequenceId) {
      fetchReplies();
      
      // Auto-refresh every 30 seconds
      const interval = autoRefresh ? setInterval(fetchReplies, 30000) : null;
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [sequenceId, autoRefresh]);

  const fetchReplies = async () => {
    try {
      const response = await fetch(`/api/sequences/check-replies?sequence_id=${sequenceId}`);
      const data = await response.json();
      
      setReplies(data.recentReplies || []);
      setStats(data.stats || { totalActive: 0, totalReplies: 0, replyRate: '0%' });
    } catch (error) {
      console.error('Error fetching replies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReplyIcon = (replyType?: string) => {
    switch (replyType) {
      case 'positive':
        return <FaceSmileIcon className="h-5 w-5 text-green-600" />;
      case 'negative':
        return <FaceFrownIcon className="h-5 w-5 text-red-600" />;
      case 'question':
        return <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600" />;
      case 'unsubscribe':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'out-of-office':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return <EnvelopeIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getReplyBadgeColor = (replyType?: string) => {
    switch (replyType) {
      case 'positive':
        return 'bg-green-100 text-green-800';
      case 'negative':
        return 'bg-red-100 text-red-800';
      case 'question':
        return 'bg-blue-100 text-blue-800';
      case 'unsubscribe':
        return 'bg-red-100 text-red-800';
      case 'out-of-office':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSentimentIcon = (sentiment?: string) => {
    switch (sentiment) {
      case 'positive':
        return '😊';
      case 'negative':
        return '😔';
      default:
        return '😐';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (compactMode) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-900">Reply Detection</h3>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`p-1 rounded ${autoRefresh ? 'text-green-600' : 'text-gray-400'}`}
            title={autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          >
            <ArrowPathIcon className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <div className="text-lg font-semibold text-gray-900">{stats.totalActive}</div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-600">{stats.totalReplies}</div>
            <div className="text-xs text-gray-500">Replies</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-green-600">{stats.replyRate}</div>
            <div className="text-xs text-gray-500">Rate</div>
          </div>
        </div>
        
        {replies.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-600 mb-2">Latest Reply:</p>
            <div className="flex items-center gap-2">
              {getReplyIcon(replies[0].metadata?.replyType)}
              <span className="text-sm text-gray-900 truncate">
                {replies[0].first_name} {replies[0].last_name}
              </span>
              <span className={`px-2 py-0.5 text-xs rounded-full ${getReplyBadgeColor(replies[0].metadata?.replyType)}`}>
                {replies[0].metadata?.replyType || 'reply'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2 text-blue-600" />
              Reply Monitor
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Automatically detecting and analyzing email replies
            </p>
          </div>
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 rounded-lg flex items-center gap-2 ${
              autoRefresh 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            <ArrowPathIcon className={`h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Active Sequences</span>
              <EnvelopeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalActive}</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-600">Total Replies</span>
              <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-900 mt-1">{stats.totalReplies}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-600">Reply Rate</span>
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-900 mt-1">{stats.replyRate}</p>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">Recent Replies (Last 7 Days)</h3>
        
        {replies.length === 0 ? (
          <div className="text-center py-8">
            <EnvelopeIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No replies detected yet</p>
            <p className="text-sm text-gray-400 mt-1">Replies will appear here automatically</p>
          </div>
        ) : (
          <div className="space-y-3">
            {replies.map((reply) => (
              <div key={reply.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getReplyIcon(reply.metadata?.replyType)}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {reply.first_name} {reply.last_name}
                        </p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${getReplyBadgeColor(reply.metadata?.replyType)}`}>
                          {reply.metadata?.replyType || 'reply'}
                        </span>
                        {reply.metadata?.sentiment && (
                          <span className="text-lg" title={`Sentiment: ${reply.metadata.sentiment}`}>
                            {getSentimentIcon(reply.metadata.sentiment)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {reply.contact_email}
                      </p>
                      {reply.description && (
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">
                          "{reply.description}"
                        </p>
                      )}
                      {reply.metadata?.suggestedAction && (
                        <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                          <span className="font-medium text-blue-900">Suggested Action: </span>
                          <span className="text-blue-700">{reply.metadata.suggestedAction}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {new Date(reply.created_at).toLocaleDateString()}
                    </p>
                    {reply.metadata?.confidence && (
                      <p className="text-xs text-gray-500 mt-1">
                        {Math.round(reply.metadata.confidence * 100)}% confidence
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}