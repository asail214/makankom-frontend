import React, { useState } from 'react';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';

interface EventFiltersProps {
  onFiltersChange: (filters: EventFilterData) => void;
  categories: Array<{ id: number; name: string; name_ar?: string }>;
}

export interface EventFilterData {
  q?: string;
  category_id?: number;
  event_type?: 'physical' | 'virtual';
  status?: string;
  from?: string;
  to?: string;
  sort?: string;
}

export const EventFilters: React.FC<EventFiltersProps> = ({
  onFiltersChange,
  categories
}) => {
  const [filters, setFilters] = useState<EventFilterData>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleFilterChange = (key: keyof EventFilterData, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: EventFilterData = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    filters[key as keyof EventFilterData] !== undefined && filters[key as keyof EventFilterData] !== ''
  );

  return (
    <Card variant="luxury" className="p-6 mb-8">
      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search events by name, description, or organizer..."
            value={filters.q || ''}
            onChange={(e) => handleFilterChange('q', e.target.value)}
            className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm bg-white pr-12"
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <span className="text-gray-400 text-xl">🔍</span>
          </div>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category_id || ''}
            onChange={(e) => handleFilterChange('category_id', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Event Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
          <select
            value={filters.event_type || ''}
            onChange={(e) => handleFilterChange('event_type', e.target.value as 'physical' | 'virtual' | undefined)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Types</option>
            <option value="physical">In-Person</option>
            <option value="virtual">Virtual</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
          <select
            value={filters.sort || ''}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Latest First</option>
            <option value="start_date">Date: Earliest First</option>
            <option value="-start_date">Date: Latest First</option>
            <option value="title">Name: A-Z</option>
            <option value="-title">Name: Z-A</option>
          </select>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-primary-600 hover:text-primary-700"
        >
          {showAdvanced ? '▼' : '▶'} Advanced Filters
        </Button>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-gray-600 hover:text-gray-700"
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
              <input
                type="date"
                value={filters.from || ''}
                onChange={(e) => handleFilterChange('from', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
              <input
                type="date"
                value={filters.to || ''}
                onChange={(e) => handleFilterChange('to', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-600 mr-2">Active filters:</span>
            {Object.entries(filters).map(([key, value]) => {
              if (!value) return null;
              
              let displayValue = value;
              if (key === 'category_id') {
                const category = categories.find(c => c.id === Number(value));
                displayValue = category?.name || value;
              }
              
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700"
                >
                  {key}: {displayValue.toString()}
                  <button
                    onClick={() => handleFilterChange(key as keyof EventFilterData, undefined)}
                    className="ml-2 text-primary-500 hover:text-primary-700"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
};