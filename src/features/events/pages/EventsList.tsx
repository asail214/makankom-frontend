import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchEvents, type EventsParams } from '../api';
import { Card } from '../../../shared/components/ui/Card';
import { InlineLoading } from '../../../shared/components/ui/LoadingSpinner';
import type { Event } from '../../../types/models';

export const EventsList: React.FC = () => {
  const { t } = useTranslation();
  
  const params: EventsParams = {
    page: 1,
  };

  const {
    data: eventsData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['events', params],
    queryFn: () => fetchEvents(params),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container py-24">
          <InlineLoading text={t('common.loading')} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container py-24">
          <Card variant="luxury" className="text-center max-w-md mx-auto">
            <div className="py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-error-50 rounded-full flex items-center justify-center">
                <span className="text-error-500 text-2xl">⚠️</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Events</h3>
              <p className="text-gray-600">{t('common.error')}</p>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const events = eventsData?.items || [];

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white to-primary-50 py-24">
        <div className="container text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Find and book tickets for the most exciting events happening around you
          </p>
          
          {/* Search Bar */}
          <div className="max-w-lg mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search events..."
                className="w-full px-6 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent shadow-sm bg-white/80 backdrop-blur-sm"
              />
              <button className="absolute right-2 top-2 bottom-2 px-6 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-gray-600 text-lg">
              Don't miss these amazing upcoming events
            </p>
          </div>
          
          {events.length === 0 ? (
            <Card variant="luxury" className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-3xl">🎫</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No Events Found</h3>
                <p className="text-gray-600 mb-6">{t('events.noEvents')}</p>
                <p className="text-sm text-gray-500">
                  Make sure your backend server is running to see events
                </p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event: Event) => (
                <Card 
                  key={event.id} 
                  variant="luxury"
                  padding="sm"
                  hover
                  className="group cursor-pointer"
                >
                  {/* Event Image */}
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    {event.banner_image ? (
                      <img 
                        src={event.banner_image} 
                        alt={event.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                        <span className="text-white text-4xl relative z-10">🎫</span>
                      </div>
                    )}
                    
                    {/* Event Badge */}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-xs font-semibold text-primary-700">Featured</span>
                    </div>
                  </div>

                  <div className="p-4">
                    {/* Event Title */}
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors">
                      {event.title}
                    </h3>
                    
                    {/* Event Description */}
                    <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                      {event.description}
                    </p>
                    
                    {/* Event Meta */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="w-4 h-4 mr-2">📅</span>
                        {new Date(event.start_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      
                      {event.venue_name && (
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="w-4 h-4 mr-2">📍</span>
                          <span className="truncate">{event.venue_name}</span>
                        </div>
                      )}
                    </div>

                    {/* Call to Action */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm font-medium text-gray-700">
                        {event.event_type === 'virtual' ? 'Online Event' : 'In-Person'}
                      </span>
                      <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
                        View Details →
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};