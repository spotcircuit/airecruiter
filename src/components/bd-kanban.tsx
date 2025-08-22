'use client';

import { useState, useEffect } from 'react';
import { DealStage } from '@/types/database';
import { ChevronRightIcon, PlusIcon, BuildingOfficeIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Deal {
  id: string;
  company_id: string;
  name: string;
  stage: DealStage;
  value?: number;
  probability?: number;
  next_step?: string;
  company_name?: string;
  company_industry?: string;
  updated_at: string;
}

const stages: { key: DealStage; label: string; color: string }[] = [
  { key: 'prospect', label: 'Prospect', color: 'bg-gray-100' },
  { key: 'discovery', label: 'Discovery', color: 'bg-blue-100' },
  { key: 'proposal', label: 'Proposal', color: 'bg-yellow-100' },
  { key: 'won', label: 'Won', color: 'bg-green-100' },
  { key: 'lost', label: 'Lost', color: 'bg-red-100' },
];

export function BDKanban() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [dragOverStage, setDragOverStage] = useState<DealStage | null>(null);

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/deals');
      if (!response.ok) {
        throw new Error(`Failed to fetch deals: ${response.status}`);
      }
      const data = await response.json();
      setDeals(data.deals || []);
    } catch (error) {
      console.error('Error fetching deals:', error);
      setDeals([]); // Show empty state instead of mock data
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, deal: Deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, stage: DealStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (e: React.DragEvent, newStage: DealStage) => {
    e.preventDefault();
    setDragOverStage(null);
    
    if (!draggedDeal || draggedDeal.stage === newStage) return;
    
    // Optimistically update UI
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === draggedDeal.id 
          ? { ...deal, stage: newStage }
          : deal
      )
    );
    
    // Update in database
    try {
      await fetch('/api/deals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: draggedDeal.id, stage: newStage })
      });
    } catch (error) {
      console.error('Error updating deal stage:', error);
      // Revert on error
      fetchDeals();
    }
    
    setDraggedDeal(null);
  };

  const getDealsByStage = (stage: DealStage) => {
    return deals.filter(deal => deal.stage === stage);
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'TBD';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getTotalValue = (stage: DealStage) => {
    const stageDeals = getDealsByStage(stage);
    const total = stageDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);
    return formatCurrency(total);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No deals in pipeline</h3>
        <p className="text-gray-600 mb-4">Add companies to your pipeline from the Discover tab</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {stages.map((stage) => {
          const stageDeals = getDealsByStage(stage.key);
          const isDropTarget = dragOverStage === stage.key;
          
          return (
            <div
              key={stage.key}
              className={`w-80 bg-gray-50 rounded-lg p-4 ${
                isDropTarget ? 'ring-2 ring-blue-500 bg-blue-50' : ''
              }`}
              onDragOver={(e) => handleDragOver(e, stage.key)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stage.key)}
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{stage.label}</h3>
                  <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                    {stageDeals.length}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  Total: {getTotalValue(stage.key)}
                </div>
              </div>
              
              <div className="space-y-3">
                {stageDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal)}
                    className={`${stage.color} p-4 rounded-lg cursor-move hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                        {deal.name}
                      </h4>
                      {deal.probability !== undefined && deal.probability !== null && (
                        <span className="text-xs bg-white px-2 py-1 rounded">
                          {deal.probability}%
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-600">
                        <BuildingOfficeIcon className="h-3 w-3 mr-1" />
                        <span className="truncate">{deal.company_name || 'Unknown'}</span>
                      </div>
                      
                      {deal.value && (
                        <div className="flex items-center text-xs text-gray-600">
                          <CurrencyDollarIcon className="h-3 w-3 mr-1" />
                          <span>{formatCurrency(deal.value)}</span>
                        </div>
                      )}
                      
                      {deal.next_step && (
                        <div className="flex items-start text-xs text-gray-600 mt-2">
                          <ChevronRightIcon className="h-3 w-3 mr-1 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{deal.next_step}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-xs text-gray-500 mt-2">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        <span>{new Date(deal.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
                
                {stage.key === 'prospect' && (
                  <button className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center">
                    <PlusIcon className="h-4 w-4 mr-1" />
                    Add Deal
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}