import React from 'react';
import type { ReactNode, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'luxury' | 'premium';
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  border?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  shadow = 'sm',
  hover = false,
  border = true,
  className = '',
  ...props
}) => {
  const baseClasses = 'bg-white rounded-xl overflow-hidden';
  
  const variantClasses = {
    default: border ? 'border border-gray-100' : '',
    luxury: 'card-luxury',
    premium: 'bg-gradient-to-br from-white to-gray-25 border border-gray-200 relative before:absolute before:top-0 before:left-0 before:right-0 before:h-0.5 before:bg-gradient-to-r before:from-accent-500 before:to-primary-500',
  };

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
  };

  const hoverClasses = hover ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};