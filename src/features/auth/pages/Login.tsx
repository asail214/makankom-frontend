import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import type { UserRole } from '../../../types/models';

export const Login: React.FC = () => {
  const [searchParams] = useSearchParams();
  const userType = (searchParams.get('type') || 'customer') as UserRole;

  return <LoginForm userType={userType} />;
};