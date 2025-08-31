import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { fetchEvents, type EventsParams } from '../api';
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-red-600 text-center">
          {t('common.error')}
        </div>
      </div>
    );
  }

  const events = eventsData?.items || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        {t('events.title')}
      </h1>
      
      {events.length === 0 ? (
        <div className="text-center text-gray-600">
          {t('events.noEvents')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event: Event) => (
            <div 
              key={event.id} 
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {event.title_en}
              </h3>
              <p className="text-gray-600 mb-4 line-clamp-3">
                {event.description_en}
              </p>
              <div className="text-sm text-gray-500">
                {new Date(event.start_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};