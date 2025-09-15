import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchEvent } from '../api';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { InlineLoading } from '../../../shared/components/ui/LoadingSpinner';

export const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: event,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => fetchEvent(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container py-24">
          <InlineLoading text="Loading event details..." />
        </div>
      </div>
    );
  }

  if (isError || !event) {
    return (
      <div className="min-h-screen bg-gray-25">
        <div className="container py-24">
          <Card variant="luxury" className="text-center max-w-md mx-auto">
            <div className="py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-error-50 rounded-full flex items-center justify-center">
                <span className="text-error-500 text-2xl">😞</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Event Not Found</h3>
              <p className="text-gray-600 mb-4">The event you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate('/events')} variant="primary">
                Browse Events
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-25">
      {/* Hero Section */}
      <section className="relative">
        {event.banner_image ? (
          <div className="h-96 bg-cover bg-center relative" style={{ backgroundImage: `url(${event.banner_image})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          </div>
        ) : (
          <div className="h-96 bg-gradient-to-br from-primary-500 to-primary-700 relative">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
        )}
        
        {/* Back Button */}
        <div className="absolute top-8 left-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white"
          >
            ← Back
          </Button>
        </div>

        {/* Event Badge */}
        <div className="absolute top-8 right-8">
          <span className={`px-4 py-2 rounded-full text-sm font-medium ${
            event.status === 'published' ? 'bg-green-500 text-white' :
            event.status === 'draft' ? 'bg-yellow-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
      </section>

      {/* Content */}
      <div className="container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card variant="luxury" className="p-8">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                  {event.title}
                </h1>
                
                {event.title_ar && (
                  <h2 className="text-2xl font-semibold text-gray-600 mb-4" dir="rtl">
                    {event.title_ar}
                  </h2>
                )}

                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  <span className="flex items-center">
                    <span className="w-4 h-4 mr-2">🗓️</span>
                    {new Date(event.start_date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                  
                  <span className="flex items-center">
                    <span className="w-4 h-4 mr-2">⏰</span>
                    {new Date(event.start_date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Event</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  {event.description}
                </p>
                
                {event.description_ar && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4" dir="rtl">عن هذه الفعالية</h3>
                    <p className="text-gray-700 leading-relaxed" dir="rtl">
                      {event.description_ar}
                    </p>
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-8 border-t border-gray-200">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Event Type</h4>
                  <p className="text-gray-600">
                    {event.event_type === 'virtual' ? '🖥️ Virtual Event' : '📍 In-Person Event'}
                  </p>
                </div>
                
                {event.min_age && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Age Requirement</h4>
                    <p className="text-gray-600">
                      {event.min_age}+ years old
                      {event.max_age && ` (Max: ${event.max_age})`}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Duration</h4>
                  <p className="text-gray-600">
                    {new Date(event.start_date).toLocaleDateString()} - {new Date(event.end_date).toLocaleDateString()}
                  </p>
                </div>

                {event.organizer && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Organizer</h4>
                    <p className="text-gray-600">{event.organizer.name}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="luxury" className="p-6 sticky top-8">
              {/* Location/Virtual Link */}
              {event.event_type === 'physical' ? (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">📍 Location</h3>
                  {event.venue_name && (
                    <p className="font-medium text-gray-800 mb-2">{event.venue_name}</p>
                  )}
                  {event.venue_address && (
                    <p className="text-gray-600 text-sm mb-4">{event.venue_address}</p>
                  )}
                </div>
              ) : (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3">🖥️ Virtual Event</h3>
                  <p className="text-gray-600 text-sm mb-4">
                    This is an online event. Join from anywhere!
                  </p>
                  {event.virtual_link && (
                    <a 
                      href={event.virtual_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      Event Link →
                    </a>
                  )}
                </div>
              )}

              {/* CTA Section */}
              <div className="space-y-3">
                <Button 
                  variant="primary" 
                  className="w-full"
                  size="lg"
                  disabled={event.status !== 'published'}
                >
                  {event.status === 'published' ? '🎫 Get Tickets' : 'Event Not Available'}
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  size="md"
                >
                  ❤️ Add to Wishlist
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  size="md"
                >
                  📤 Share Event
                </Button>
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Event ID</span>
                  <span className="font-medium">#{event.id}</span>
                </div>
                
                {event.category && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="font-medium">{event.category.name}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};