import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';

export const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      type: 'customer',
      title: 'Customer',
      description: 'Book tickets and discover amazing events',
      icon: '🎫',
      color: 'from-blue-500 to-blue-600',
      features: ['Browse events', 'Book tickets', 'Manage orders', 'Create wishlist']
    },
    {
      type: 'organizer',
      title: 'Event Organizer',
      description: 'Create and manage your events',
      icon: '🎪',
      color: 'from-purple-500 to-purple-600',
      features: ['Create events', 'Manage tickets', 'View analytics', 'Handle bookings']
    },
    {
      type: 'admin',
      title: 'Administrator',
      description: 'Manage platform and users',
      icon: '⚙️',
      color: 'from-red-500 to-red-600',
      features: ['Platform management', 'User oversight', 'Event approval', 'System reports']
    },
    {
      type: 'scan-point',
      title: 'Scan Point',
      description: 'Ticket scanning and validation',
      icon: '📱',
      color: 'from-green-500 to-green-600',
      features: ['Scan tickets', 'Validate entries', 'Real-time sync', 'Offline support']
    }
  ];

  const handleRoleSelect = (roleType: string) => {
    navigate(`/login?type=${roleType}`);
  };

  return (
    <div className="min-h-screen bg-gray-25 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Makankom
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to access the platform and start your journey with us
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {roles.map((role) => (
            <Card
              key={role.type}
              variant="luxury"
              hover
              className="cursor-pointer group"
              onClick={() => handleRoleSelect(role.type)}
            >
              <div className="p-6 text-center">
                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${role.color} rounded-xl flex items-center justify-center text-2xl transform group-hover:scale-110 transition-transform duration-200`}>
                  {role.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {role.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-4 text-sm">
                  {role.description}
                </p>

                {/* Features */}
                <ul className="text-xs text-gray-500 space-y-1 mb-6">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <span className="w-1.5 h-1.5 bg-primary-400 rounded-full mr-2"></span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full group-hover:shadow-lg transition-shadow"
                >
                  Sign In as {role.title}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            New customer? Start by creating your account
          </p>
          <Button
            variant="accent"
            onClick={() => navigate('/register')}
            className="px-8"
          >
            Create Customer Account
          </Button>
        </div>
      </div>
    </div>
  );
};

// Make sure this export is present - this might be missing
export default RoleSelection;