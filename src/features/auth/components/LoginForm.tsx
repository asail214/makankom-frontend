import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { login } from '../api';
import { Button } from '../../../shared/components/ui/Button';
import { Card } from '../../../shared/components/ui/Card';
import type { UserRole } from '../../../types/models';

interface LoginFormProps {
  userType: UserRole;
}

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    email: string;
    name: string;
    [key: string]: unknown;
  };
  token: string;
}

interface ApiError {
  response?: {
    data?: {
      message?: string;
      errors?: Record<string, string[]>;
    };
  };
}

export const LoginForm: React.FC<LoginFormProps> = ({ userType }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const loginMutation = useMutation({
    mutationFn: (data: LoginFormData) => login(userType, data),
    onSuccess: (response: LoginResponse) => {
      const { user, token } = response;
      authLogin(user, userType, token);
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || `/${userType}/dashboard`;
      navigate(from, { replace: true });
    },
    onError: (error: ApiError) => {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || 'Login failed' });
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    loginMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const getUserTypeTitle = () => {
    switch (userType) {
      case 'customer': return t('auth.customerLogin');
      case 'organizer': return t('auth.organizerLogin');
      case 'admin': return t('auth.adminLogin');
      case 'scan-point': return t('auth.scanPointLogin');
      default: return t('auth.login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-25 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            {getUserTypeTitle()}
          </h2>
          <p className="mt-2 text-gray-600">
            {t('auth.signInToAccount')}
          </p>
        </div>

        <Card variant="luxury" className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {errors.general && (
              <div className="bg-error-50 border border-error-200 text-error-700 px-4 py-3 rounded-lg">
                {errors.general}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.email')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-error-500' : 'border-gray-200'
                }`}
                placeholder={t('auth.emailPlaceholder')}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-error-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                {t('auth.password')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-error-500' : 'border-gray-200'
                }`}
                placeholder={t('auth.passwordPlaceholder')}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-error-600">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loginMutation.isPending}
            >
              {loginMutation.isPending ? t('common.loading') : t('auth.signIn')}
            </Button>
          </form>

          {userType === 'customer' && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t('auth.dontHaveAccount')}{' '}
                <button
                  onClick={() => navigate('/register')}
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  {t('auth.signUp')}
                </button>
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};