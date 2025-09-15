import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card';
import type { Event } from '../../../types/models';

interface EventCardProps {
  event: Event;
  showOrganizer?: boolean;
  className?: string;
}

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  showOrganizer = true,
  className = '' 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/events/${event.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card 
      variant="luxury"
      padding="sm"
      hover
      className={`group cursor-pointer ${className}`}
      onClick={handleClick}
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
          <span className="text-xs font-semibold text-primary-700">
            {event.event_type === 'virtual' ? 'Virtual' : 'In-Person'}
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            event.status === 'published' ? 'bg-green-500 text-white' :
            event.status === 'draft' ? 'bg-yellow-500 text-white' :
            'bg-gray-500 text-white'
          }`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>
      </div>

      <div className="p-4">
        {/* Event Title */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-700 transition-colors">
          {event.title}
        </h3>
        
        {/* Event Description */}
        {event.description && (
          <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
            {event.description}
          </p>
        )}
        
        {/* Event Meta */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-500">
            <span className="w-4 h-4 mr-2">📅</span>
            <span>{formatDate(event.start_date)}</span>
            <span className="mx-2">•</span>
            <span>{formatTime(event.start_date)}</span>
          </div>
          
          {event.venue_name && event.event_type === 'physical' && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-4 h-4 mr-2">📍</span>
              <span className="truncate">{event.venue_name}</span>
            </div>
          )}

          {event.event_type === 'virtual' && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-4 h-4 mr-2">🖥️</span>
              <span>Online Event</span>
            </div>
          )}

          {/* Organizer */}
          {showOrganizer && event.organizer && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-4 h-4 mr-2">👤</span>
              <span className="truncate">by {event.organizer.name}</span>
            </div>
          )}

          {/* Category */}
          {event.category && (
            <div className="flex items-center text-sm text-gray-500">
              <span className="w-4 h-4 mr-2">🏷️</span>
              <span>{event.category.name}</span>
            </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">
            {event.event_type === 'virtual' ? 'Join Online' : 'Attend Event'}
          </span>
          <span className="text-primary-600 font-medium text-sm group-hover:text-primary-700 transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Card>
  );
};

// Add this default export
export default EventCard;