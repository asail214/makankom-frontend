import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../auth/hooks/useAuth';
import { Card } from '../../../shared/components/ui/Card';
import { Button } from '../../../shared/components/ui/Button';
import { InlineLoading } from '../../../shared/components/ui/LoadingSpinner';
import api from '../../../shared/api/api';

interface CustomerProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  date_of_birth?: string;
  gender?: 'male' | 'female';
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  preferred_language: string;
  notification_preferences: {
    email_notifications: boolean;
    sms_notifications: boolean;
    marketing_emails: boolean;
  };
}

const fetchCustomerProfile = async (): Promise<CustomerProfile> => {
  const { data } = await api.get('/customer/profile');
  return data.data || data;
};

const updateCustomerProfile = async (profileData: Partial<CustomerProfile>) => {
  const { data } = await api.put('/customer/profile', profileData);
  return data.data || data;
};

export const CustomerProfile: React.FC = () => {
  const { user, login } = useAuth();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: profile, isLoading } = useQuery({
    queryKey: ['customer-profile'],
    queryFn: fetchCustomerProfile,
    retry: 1,
  });

  const [formData, setFormData] = useState<Partial<CustomerProfile>>({});

  React.useEffect(() => {
    if (profile && !isEditing) {
      setFormData(profile);
    }
  }, [profile, isEditing]);

  const updateMutation = useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: (updatedProfile) => {
      queryClient.setQueryData(['customer-profile'], updatedProfile);
      // Update auth context with new user data
      login(updatedProfile, 'customer', localStorage.getItem('token') || '');
      setIsEditing(false);
      setErrors({});
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        const formattedErrors: Record<string, string> = {};
        Object.entries(error.response.data.errors).forEach(([key, messages]) => {
          formattedErrors[key] = Array.isArray(messages) ? messages[0] : messages;
        });
        setErrors(formattedErrors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Update failed' });
      }
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      if (name.startsWith('notification_preferences.')) {
        const prefKey = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          notification_preferences: {
            ...prev.notification_preferences!,
            [prefKey]: checkbox.checked
          }
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleCancel = () => {
    setFormData(profile || {});
    setIsEditing(false);
    setErrors({});
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <InlineLoading text="Loading your profile..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} variant="primary">
            Edit Profile
          </Button>
        ) : (
          <div className="flex space-x-3">
            <Button onClick={handleCancel} variant="ghost">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="primary"
              loading={updateMutation.isPending}
            >
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card variant="luxury" className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h2>
          
          {errors.general && (
            <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg mb-6">
              {errors.general}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isEditing ? 'bg-white' : 'bg-gray-50'
                } ${errors.first_name ? 'border-error-500' : 'border-gray-200'}`}
              />
              {errors.first_name && (
                <p className="mt-1 text-sm text-error-600">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isEditing ? 'bg-white' : 'bg-gray-50'
                } ${errors.last_name ? 'border-error-500' : 'border-gray-200'}`}
              />
              {errors.last_name && (
                <p className="mt-1 text-sm text-error-600">{errors.last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isEditing ? 'bg-white' : 'bg-gray-50'
                } ${errors.email ? 'border-error-500' : 'border-gray-200'}`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isEditing ? 'bg-white' : 'bg-gray-50'
                } ${errors.phone ? 'border-error-500' : 'border-gray-200'}`}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-error-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isEditing ? 'bg-white' : 'bg-gray-50'
                } ${errors.date_of_birth ? 'border-error-500' : 'border-gray-200'}`}
              />
              {errors.date_of_birth && (
                <p className="mt-1 text-sm text-error-600">{errors.date_of_birth}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isEditing ? 'bg-white' : 'bg-gray-50'
                } ${errors.gender ? 'border-error-500' : 'border-gray-200'}`}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {errors.gender && (
                <p className="mt-1 text-sm text-error-600">{errors.gender}</p>
              )}
            </div>
          </div>
        </Card>

        {/* Preferences */}
        <Card variant="luxury" className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Preferences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Language
              </label>
              <select
                name="preferred_language"
                value={formData.preferred_language || 'en'}
                onChange={handleInputChange}
                disabled={!isEditing}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  isEditing ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="mt-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notification_preferences.email_notifications"
                  checked={formData.notification_preferences?.email_notifications || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">Email notifications for event updates</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notification_preferences.sms_notifications"
                  checked={formData.notification_preferences?.sms_notifications || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">SMS notifications for important updates</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="notification_preferences.marketing_emails"
                  checked={formData.notification_preferences?.marketing_emails || false}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <span className="ml-3 text-sm text-gray-700">Marketing emails about new events and offers</span>
              </label>
            </div>
          </div>
        </Card>
      </form>
    </div>
  );
};