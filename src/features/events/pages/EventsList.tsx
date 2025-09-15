import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchEvents, fetchEventCategories, type EventsParams } from '../api';
import { Card } from '../../../shared/components/ui/Card';
import { InlineLoading } from '../../../shared/components/ui/LoadingSpinner';
import { EventFilters, type EventFilterData } from '../components/EventFilters';
import { EventCard } from '../components/EventCard';
import type { Event } from '../../../types/models';

export const EventsList: React.FC = () => {
  const { t } = useTranslation();
  const [filters, setFilters] = useState<EventFilterData>({});
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch categories for filters
  const { data: categories = [] } = useQuery({
    queryKey: ['event-categories'],
    queryFn: fetchEventCategories,
  });

  // Build query params
  const params: EventsParams = {
    page: currentPage,
    ...filters,
  };

  const {
    data: eventsData,
    isLoading,
    error,
    isError
  } = useQuery({
    queryKey: ['events', params],
    queryFn: () => fetchEvents(params),
    retry: 2,
    retryDelay: 1000,
  });

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const handleFiltersChange = (newFilters: EventFilterData) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container py-24">
          <InlineLoading text={t('common.loading')} />
        </div>
      </div>
    );
  }

  if (isError) {
    console.error('EventsList error:', error);
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container py-24">
          <Card variant="luxury" className="text-center max-w-md mx-auto">
            <div className="py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-error-50 rounded-full flex items-center justify-center">
                <span className="text-error-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Events</h3>
              <p className="text-gray-600 mb-4">{t('common.error')}</p>
              <p className="text-sm text-gray-500">
                Please check if your backend server is running on port 8000
              </p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const events = eventsData?.data || [];
  const meta = eventsData?.meta;
  const eventsCount = events.length;
  const totalEvents = meta?.total || 0;

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Header */}
      <section className="bg-white py-12 border-b border-gray-200">
        <div className="container">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Events
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find amazing events happening around you. Filter by category, type, date and more.
            </p>
          </div>

          {/* Results Summary */}
          <div className="text-center">
            <p className="text-gray-600">
              {totalEvents > 0 ? (
                <>
                  Showing {eventsCount} of {totalEvents} events
                  {meta && meta.current_page > 1 && (
                    <> (Page {meta.current_page} of {meta.last_page})</>
                  )}
                </>
              ) : (
                'No events found'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Filters and Events */}
      <section className="py-8">
        <div className="container">
          {/* Filters - Remove the isLoading prop */}
          <EventFilters
            onFiltersChange={handleFiltersChange}
            categories={categories}
          />

          {/* Events Grid */}
          {eventsCount === 0 ? (
            <Card variant="luxury" className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-3xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Events Found</h3>
                <p className="text-gray-600 mb-6">
                  {Object.keys(filters).length > 0 
                    ? 'Try adjusting your filters to see more events.'
                    : 'No events are currently available.'
                  }
                </p>
                {Object.keys(filters).length > 0 && (
                  <button
                    onClick={() => setFilters({})}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {events.map((event: Event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>

              {/* Pagination */}
              {meta && meta.last_page > 1 && (
                <div className="flex justify-center items-center space-x-4">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex space-x-2">
                    {Array.from({ length: Math.min(5, meta.last_page) }, (_, i) => {
                      const page = i + 1;
                      const isActive = page === currentPage;
                      
                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          disabled={isLoading}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                            isActive
                              ? 'bg-primary-500 text-white'
                              : 'text-gray-600 bg-white border border-gray-200 hover:bg-gray-50'
                          } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                          {page}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta.last_page || isLoading}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}

              {/* Loading indicator for pagination */}
              {isLoading && currentPage > 1 && (
                <div className="text-center mt-8">
                  <InlineLoading text="Loading more events..." />
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};